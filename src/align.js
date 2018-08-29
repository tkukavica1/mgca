var memo = {} // Dictionary used to memoize alignments that have already been calculated.
const gapScore = -2
const positionMatch = 3

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
            return align(clusterMatrix[0], clusterMatrix[1])
        } catch (error) {
            throw 'Error: Failed to align the 2 provided gene clusters.'
        }
    }
    else if (clusterMatrix.length < 2) {
        console.log('Less than 2 gene clusters provided, returning original input.')
        return clusterMatrix
    }
}

function alignMultiple(clusterMatrix) {
    // Returns an alignResult representing many clusters in optimal alignment and the score.
    // IDEA: Create 3 temp matrices (gap left, gap right, no gap), and test on each one. Return the optimal one.
}

function alignTwo(clusterMatrix) {
    // Returns an alignResult with the optimal clusterMatrix and alignment score.
    let key = generateKey(clusterMatrix)
    if (checkExistingAlignment(key)) {
        console.log('Key found in memoization hash!')
        return memo[key]
    }
    if (clusterMatrix[0].length === 0 && clusterMatrix[1].length === 0) {
        // NEED TO MEMOIZE THIS AND OTHERS
        return {clusterMatrix: clusterMatrix, score: 0}
    }
    if (clusterMatrix[0].length === 0) {
        return {clusterMatrix: clusterMatrix, score: clusterMatrix[1].length * gapScore}
    }
    if (clusterMatrix[1].length === 0) {
        return {clusterMatrix: clusterMatrix, score: clusterMatrix[0].length * gapScore}
    }
    let subArray1 = clusterMatrix[0].splice(clusterMatrix[0].length - 1, 1)
    let subArray2 = clusterMatrix[1].splice(clusterMatrix[1].length - 1, 1)
    let alignment1 = alignTwo([subArray1, clusterMatrix[1]])
    let alignment2 = alignTwo([clusterMatrix[0], subArray2])
    let alignment3 = alignTwo([subArray1, subArray2])
    let optimalAlignment = {clusterMatrix: [], score: 0}
    if (alignment1.score >= alignment2.score && alignment1.score >= alignment3.score) {
        optimalAlignment.score += alignment1.score
        optimalAlignment.clusterMatrix[0] = clusterMatrix[0]
        optimalAlignment.clusterMatrix[1] = alignment1.clusterMatrix[1].concat('-')
    }
    else if (alignment2.score >= alignment3.score) {
        optimalAlignment.score += alignment2.score
    }
    else {
        optimalAlignment.score += alignment3.score
    }
    return optimalAlignment
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
 * Test function that prints to the console.
 */
function testConnection() {
    console.log('MGCA is connected.')
}

exports.testConnection = testConnection
exports.runMGCA = runMGCA