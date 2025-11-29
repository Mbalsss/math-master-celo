// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// OpenZeppelin imports (install via npm for Hardhat/Foundry/Remix)
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MathMasterCelo - a simple quiz game that pays correct answers in CELO
/// @notice Owner funds the contract with CELO, owner can add questions. Players pay optional entry fees and earn rewards when correct.
contract MathMasterCelo is ReentrancyGuard, Ownable {
struct Question {
string text;
string[] options;
uint8 correctIndex; // 0-based
uint256 rewardWei; // reward in wei (CELO)
uint256 entryFeeWei; // optional entry fee required to attempt
bool active;
}

Question[] public questions;

// player address => total correct answers (score)
mapping(address => uint256) public scores;

// question id => attempt count
mapping(uint256 => uint256) public attempts;

// events
event QuestionAdded(uint256 indexed qId, string text, uint256 rewardWei, uint256 entryFeeWei);
event QuestionToggled(uint256 indexed qId, bool active);
event AnswerResult(uint256 indexed qId, address indexed player, bool correct, uint256 rewardPaid);
event FundsDeposited(address indexed from, uint256 amount);
event FundsWithdrawn(address indexed to, uint256 amount);

/* ========== CONFIG ========== */

/// @notice Add a new question (owner only)
/// @param _text the question text
/// @param _options array of option strings (must be length >= 2)
/// @param _correctIndex 0-based index of correct option
/// @param _rewardWei reward in wei of CELO to pay if correct
/// @param _entryFeeWei entry fee in wei required to attempt (0 = free)
function addQuestion(
string calldata _text,
string[] calldata _options,
uint8 _correctIndex,
uint256 _rewardWei,
uint256 _entryFeeWei
) external onlyOwner {
require(_options.length >= 2, "Need at least 2 options");
require(_correctIndex < _options.length, "Invalid correct index");

Question memory q;
q.text = _text;
q.options = _toArray(_options);
q.correctIndex = _correctIndex;
q.rewardWei = _rewardWei;
q.entryFeeWei = _entryFeeWei;
q.active = true;

questions.push(q);
uint256 qId = questions.length - 1;
emit QuestionAdded(qId, _text, _rewardWei, _entryFeeWei);
}

/// @notice Toggle a question's active flag (owner only)
function toggleQuestion(uint256 qId, bool active) external onlyOwner {
require(qId < questions.length, "Invalid qId");
questions[qId].active = active;
emit QuestionToggled(qId, active);
}

/// @notice Player answers a question. If correct, they immediately receive the reward (in CELO)
/// @param qId question index
/// @param choiceIndex player's chosen option index (0-based)
function answerQuestion(uint256 qId, uint8 choiceIndex) external payable nonReentrant {
require(qId < questions.length, "Invalid qId");
Question storage q = questions[qId];
require(q.active, "Question not active");

// require entry fee if set
if (q.entryFeeWei > 0) {
require(msg.value == q.entryFeeWei, "Incorrect entry fee");
} else {
// if question free but user accidentally sent funds, refund (or accept? we revert)
require(msg.value == 0, "This question requires no ETH/CELO");
}

attempts[qId] += 1;
bool correct = (choiceIndex == q.correctIndex);
uint256 paid = 0;

if (correct && q.rewardWei > 0) {
// ensure contract has enough balance
require(address(this).balance >= q.rewardWei, "Insufficient contract funds for reward");
paid = q.rewardWei;

// transfer native CELO securely using call
(bool sent, ) = payable(msg.sender).call{value: paid}("");
require(sent, "Reward transfer failed");

// update player's score
scores[msg.sender] += 1;
}

emit AnswerResult(qId, msg.sender, correct, paid);
}

/* ========== FUNDING & WITHDRAWAL ========== */

/// @notice Owner can deposit funds simply by sending CELO to the contract address, but we expose a helper
receive() external payable {
emit FundsDeposited(msg.sender, msg.value);
}

/// @notice Explicit deposit function
function depositFunds() external payable onlyOwner {
require(msg.value > 0, "Send CELO to deposit");
emit FundsDeposited(msg.sender, msg.value);
}

/// @notice Owner withdraws CELO remaining in contract
function withdraw(uint256 amountWei) external onlyOwner nonReentrant {
require(amountWei <= address(this).balance, "Not enough funds");
(bool sent, ) = payable(owner()).call{value: amountWei}("");
require(sent, "Withdraw failed");
emit FundsWithdrawn(owner(), amountWei);
}

/* ========== VIEW HELPERS ========== */

function totalQuestions() external view returns (uint256) {
return questions.length;
}

function getQuestion(uint256 qId) external view returns (
string memory text,
string[] memory options,
uint8 correctIndex,
uint256 rewardWei,
uint256 entryFeeWei,
bool active
) {
require(qId < questions.length, "Invalid qId");
Question storage q = questions[qId];
return (q.text, q.options, q.correctIndex, q.rewardWei, q.entryFeeWei, q.active);
}

/* ========== INTERNAL HELPERS ========== */

// copies calldata array to memory array (since storage -> calldata conversions limited)
function _toArray(string[] calldata input) internal pure returns (string[] memory out) {
out = new string[](input.length);
for (uint i = 0; i < input.length; i++) {
out[i] = input[i];
}
}
}
