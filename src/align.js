var memo = {} // Dictionary used to memoize alignments that have already been calculated.
const gapScore = -2
const positionMatch = 3

function runMGCA(clusterMatrix, numClusters) {
    console.log('Running multiple gene cluster alignment.')
    let key = generateKey(clusterMatrix)
    if (checkExistingAlignment(key)) {
        console.log('Key found in memoization hash!')
        return memo[key]
    }
    if (numClusters == 2) {
        try {
            return align(clusterMatrix[0], clusterMatrix[1])
        } catch (error) {
            throw 'Error: Failed to align the 2 provided gene clusters.'
        }
    }
    else if (numClusters < 2) {
        console.log('Less than 2 gene clusters provided, returning original input.')
        return clusterMatrix
    }
}

function alignMultiple(clusterMatrix, numClusters) {
    // Returns a matrix representing many clusters in optimal alignment.
    // IDEA: Create 3 temp matrices (gap left, gap right, no gap), and test on each one. Return the optimal one.
}

function alignTwo(seq1, seq2) {
    // Returns an array with 2 arrays as its elements.
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