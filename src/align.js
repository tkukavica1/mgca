require('./ms.js')

var memo = {} // Dictionary used to memoize alignments that have already been calculated.
const gapScore = -2
const positionMatch = 4

// let input = [[4,3,2,1],[4,3,1],[4,3,1],[4,3,1]]
// console.log('Input: ' + JSON.stringify(input) + ', Result: ' + JSON.stringify(runMGCA(input)))

/**
 * Runs MGCA on an array of gene clusters, which we call a cluster matrix.
 * 
 * @param {any} clusterMatrix An array where each element is an array representing one cluster.
 * 
 * @returns The aligned gene clusters.
 */
function runMGCA(clusterMatrix) {
    console.log('Running multiple gene cluster alignment.')
    memo = {}
    let key = generateKey(clusterMatrix)
    if (checkExistingAlignment(key)) {
        console.log('Key found in memoization hash!')
        return memo[key]
    }
    if (clusterMatrix.length == 2) {
        try {
            return alignTwo(clusterMatrix)
        } catch (error) {
            throw 'Error: Failed to align the 2 provided gene clusters.'
        }
    }
    else if (clusterMatrix.length < 2) {
        console.log('Less than 2 gene clusters provided, returning original input.')
        return clusterMatrix
    }
    else {
        try {
            return alignMultiple(clusterMatrix)
        } catch (error) {
            throw 'Error: Failed to align the provided gene clusters.'
        }
    }
}

/**
 * Aligns more than 2 gene clusters in the form of an array of clusters (matrix).
 * 
 * @param {any} clusterMatrix An array where each element is an array representing one cluster.
 * 
 * @returns The aligned gene clusters.
 */
function alignMultiple(clusterMatrix) {
    // Returns an alignResult representing many clusters in optimal alignment and the score.
    let final = []
    let temp = {clusterMatrix: [[],clusterMatrix[0]], score: 0}
    for (let i = 1; i < clusterMatrix.length; i++) {
        let newArr = alignTwo([temp.clusterMatrix[1], clusterMatrix[i]])
        temp = newArr
        if (i === 1)
            final.push(temp.clusterMatrix[0])
        final.push(temp.clusterMatrix[1])
    }
    return {clusterMatrix: final, score: temp.score}
}

/**
 * Runs a recursive pairwise alignment algorithm on two gene cluster sequences.
 * 
 * @param {any} clusterMatrix
 * 
 * @returns A dictionary with properties:
 *              clusterMatrix --> An array with two elements, the two optimally aligned sequences.
 *              score --> The optimal alignment score based on provided match and gap scores. 
 */
function alignTwo(clusterMatrix) {
    memo = {}
    // Returns an alignResult with the optimal clusterMatrix and alignment score.
    let key = generateKey(clusterMatrix)
    if (checkExistingAlignment(key)) {
        console.log('Key found in memoization hash!')
    }
    else if (clusterMatrix[0].length === 0 && clusterMatrix[1].length === 0) {
        memo[key] = {clusterMatrix: clusterMatrix, score: 0}
    }
    else if (clusterMatrix[0].length === 0) {
        let gapArray = buildGapArray(clusterMatrix[1].length)
        memo[key] = {clusterMatrix: [gapArray, clusterMatrix[1]], score: clusterMatrix[1].length * gapScore}
    }
    else if (clusterMatrix[1].length === 0) {
        let gapArray = buildGapArray(clusterMatrix[0].length)
        memo[key] = {clusterMatrix: [clusterMatrix[0], gapArray], score: clusterMatrix[0].length * gapScore}
    }
    else {
        let subArray1 = clusterMatrix[0].slice(0, clusterMatrix[0].length - 1)
        let subArray2 = clusterMatrix[1].slice(0, clusterMatrix[1].length - 1)
        let alignment1 = alignTwo([subArray1, clusterMatrix[1]])
        let alignment2 = alignTwo([clusterMatrix[0], subArray2])
        let alignment3 = alignTwo([subArray1, subArray2])
        alignment1.score += gapScore
        alignment2.score += gapScore
        if (clusterMatrix[0][clusterMatrix[0].length - 1] === clusterMatrix[1][clusterMatrix[1].length - 1]) {
            alignment3.score += positionMatch
        }
        let optimalAlignment = {clusterMatrix: [[],[]], score: 0}
        if (alignment1.score >= alignment2.score && alignment1.score >= alignment3.score) {
            alignment1.clusterMatrix[0].push(clusterMatrix[0][clusterMatrix[0].length - 1])
            alignment1.clusterMatrix[1].push('-')
            optimalAlignment = alignment1
        }
        else if (alignment2.score >= alignment3.score) {
            alignment2.clusterMatrix[0].push('-')
            alignment2.clusterMatrix[1].push(clusterMatrix[1][clusterMatrix[1].length - 1])
            optimalAlignment = alignment2
        }
        else {
            optimalAlignment.score += alignment3.score
            alignment3.clusterMatrix[0].push(clusterMatrix[0][clusterMatrix[0].length - 1])
            alignment3.clusterMatrix[1].push(clusterMatrix[1][clusterMatrix[1].length - 1])
            optimalAlignment = alignment3
        }
        memo[key] = optimalAlignment
    }
    return memo[key]
}

/**
 * Check if the MGCA represented by the key has already been computed.
 * 
 * @param {any} key The key representing the MGCA in question.
 * 
 * @returns True if key is in the memo dictionary, false if otherwise.
 */
function checkExistingAlignment(key) {
    if (key in memo)
        return true
    return false
}

/**
 * Generates a key for the provided gene cluster matrix.
 * 
 * @param {any} clusterMatrix An array of array, with each element representing one gene cluster.
 * 
 * @returns Unique key for the provided gene cluster matrix.
 */
function generateKey(clusterMatrix) {
    let key = ''
    try {
        for (let i = 0; i < clusterMatrix.length; i++) {
            for (let j = 0; j < clusterMatrix[i].length; j++) {
                key += clusterMatrix[i][j] + ','
            }
            key += '|'
        }
    } catch (error) {
        throw 'Error: Key generation failed.'
    }
    return key
}

/**
 * Check if the MGCA represented by the key has already been computed.
 * 
 * @param {any} length The length of the gap array to be created.
 * 
 * @returns An array of desired length with a gap in all elements.
 */
function buildGapArray(length) {
    let gapArray = []
    for (let i = 0; i < length; i++)
        gapArray.push('-')
    return gapArray
}

/**
 * Test function that prints to the console.
 */
function testConnection() {
    console.log('MGCA is connected.')
}

exports.testConnection = testConnection
exports.alignMultiple = alignMultiple
exports.alignTwo = alignTwo
exports.runMGCA = runMGCA