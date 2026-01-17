var Arbiter = /** @class */ (function () {
    function Arbiter() {
        this.activeProblemIndex = 0;
        this.solveWhenValidating = true;
    }
    Arbiter.prototype.setActiveScenario = function (scenario) {
        this.activeScenario = scenario;
    };
    Arbiter.prototype.hasScenario = function () {
        if (this.activeScenario == null)
            return false;
        return true;
    };
    /**
     * Gets the Arbiter's Active Problem
     * @returns {Problem} returns a Problem Object...
     */
    Arbiter.prototype.activeProblem = function () {
        if (this.activeScenario == null)
            return new Problem();
        if (this.activeScenario.Problems.length == 0)
            return new Problem();
        return this.activeScenario.Problems[this.activeProblemIndex];
    };
    Arbiter.prototype.validate = function (input) {
        return this.activeProblem().validate(input, this.solveWhenValidating);
    };
    Arbiter.prototype.cycleNext = function () {
        if (this.activeProblemIndex < this.activeScenario.Problems.length - 1) {
            this.activeProblemIndex++;
        }
        else {
            this.activeProblemIndex = 0;
        }
    };
    Arbiter.prototype.cyclePrev = function () {
        if (this.activeProblemIndex > 0) {
            this.activeProblemIndex--;
        }
        else {
            this.activeProblemIndex = this.activeScenario.Problems.length - 1;
        }
    };
    return Arbiter;
}());
var Scenario = /** @class */ (function () {
    function Scenario() {
        this.Problems = [];
    }
    Scenario.prototype.allSolved = function () {
        for (var i in this.Problems) {
            if (this.Problems[i].allSolved() != true) {
                return false;
            }
        }
        return true;
    };
    return Scenario;
}());
var Problem = /** @class */ (function () {
    function Problem() {
        this.Solutions = [];
    }
    Problem.prototype.allSolved = function () {
        for (var i in this.Solutions) {
            if (this.Solutions[i].solved != true) {
                return false;
            }
        }
        return true;
    };
    Problem.prototype.validate = function (input, solveWhenValidating) {
        for (var i in this.Solutions) {
            if (this.Solutions[i].solved != true && input == this.Solutions[i].solutionText) {
                if (solveWhenValidating == true) {
                    this.Solutions[i].solved = true;
                }
                if (this.allSolved() == true) {
                    return true;
                }
                else {
                    return null; // this is a partial solution, same as it is in the original C# Arbiter.
                }
            }
        }
        if (this.Solutions.length == 0)
            return true; // we got em all... err...
        return false;
    };
    return Problem;
}());
var Solution = /** @class */ (function () {
    function Solution(slnText, valdnScript, valdnExpression, freeLine) {
        if (freeLine === void 0) { freeLine = false; }
        this.solutionText = slnText;
        this.validationScript = valdnScript;
        this.validationExpression = valdnExpression;
        this.freeLineMatch = freeLine;
        this.solved = false;
    }
    return Solution;
}());
// todo: replace below functions with something more elegant
function ConvertJSONToScenario(jsonScenario) {
    var ascen = new Scenario();
    ascen.scenarioName = jsonScenario.scenarioName;
    ascen.scenarioId = jsonScenario.scenarioId;
    for (var i in jsonScenario.problems) {
        ascen.Problems.push(ConvertJSONToProblem(jsonScenario.problems[i]));
    }
    return ascen;
}
function ConvertJSONToProblem(jsonProblem) {
    var aprob = new Problem();
    aprob.problemText = jsonProblem.problemText;
    for (var i in jsonProblem.solutions) {
        aprob.Solutions.push(ConvertJSONToSolution(jsonProblem.solutions[i]));
    }
    return aprob;
}
function ConvertJSONToSolution(jsonSolution) {
    return new Solution(jsonSolution.solutionText, jsonSolution.validationScript, jsonSolution.validationExpression, jsonSolution.freeLineMatch);
}
var PowershellHandle = /** @class */ (function () {
    function PowershellHandle(username) {
        this.userName = username;
    }
    /**
     * Gets the probable powershell history file path on windows using the internal provided username
     * @returns {String} the path of the history file (txt).
     */
    PowershellHandle.prototype.historyPath = function () {
        return 'C:\\Users\\' + this.userName + '\\AppData\\Roaming\\Microsoft\\Windows\\Powershell\\PSReadLine\\ConsoleHost_history.txt';
    };
    return PowershellHandle;
}());
/// <reference path="./TSLib/arbiter.ts" />
/// <reference path="./TSLib/powerShell.ts" />
if (typeof module != 'undefined') 
{
    module.exports = {
        // arbiter.ts
        Arbiter,
        Scenario,
        Problem,
        Solution,
        ConvertJSONToScenario,
        // powershell.ts
        PowershellHandle
    };
}