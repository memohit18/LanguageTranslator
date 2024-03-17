// Memoization object to store already computed routes
const memoization = {};

function generateRoutes(centers, currentRoute, routes) {
    const key = centers.join('-');
    if (memoization[key]) {
        routes.push(...memoization[key]);
        return;
    }
    
    if (centers.length === 0) {
        routes.push(currentRoute.slice()); // Add the current route to the routes array
        memoization[key] = [currentRoute.slice()];
        return;
    }

    for (let i = 0; i < centers.length; i++) {
        const center = centers[i];
        const newRoute = [...currentRoute, center];
        const remainingCenters = centers.filter((_, index) => index !== i);

        // Add possible route from center to L1
        generateRoutes(remainingCenters, [...newRoute, 'L1'], routes);

        // Add possible route from center to another center and then to L1
        for (let j = 0; j < remainingCenters.length; j++) {
            const nextCenter = remainingCenters[j];
            generateRoutes(remainingCenters.filter((_, index) => index !== j), [...newRoute, nextCenter, 'L1'], routes);
        }
    }
}

function getAllPossibleRoutes(centers) {
    const routes = [];
    generateRoutes(centers, [], routes);
    return routes;
}

function calculateTotalCost(route, totalweightcost) {
    const distance = {
        c1l1: 3,
        c2l1: 2.5,
        c3l1: 2,
        c1c2: 4,
        c2c3: 3
    };

    let totalCost = [];

    const calculateRouteCost = (route) => {
        let cost = 0;
        for (let i = 0; i < route.length - 1; i++) {
            const current = route[i];
            const next = route[i + 1];
            if (current === 'L1') {
                cost += distance[`c${next}l1`] * totalweightcost[`C${next}`];
            } else if (next === 'L1') {
                cost += distance[`c${current}l1`] * 10; // L1 cost
            } else {
                cost += distance[`c${current}c${next}`] * totalweightcost[`C${current}`];
            }
        }
        return cost;
    };

    for (const possibleRoute of getAllPossibleRoutes(route)) {
        totalCost.push(calculateRouteCost(possibleRoute));
    }

    return Math.min(...totalCost);
}

//unit cost according to weight
function calculateOutput(input) {
    if (input >= 0 && input <= 5) {
        return 10;
    } else if (input > 5) {
        return 10 + Math.floor((input - 1) / 5) * 8; // Subtract 1 from input for correct calculation
    } else {
        return "Invalid input";
    }
}

const getMinimumCost = (req, res) => {
    let transitData = req.body;

    // Validate keys
    const validKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const requestData = req.body;

    for (const key in requestData) {
        if (!validKeys.includes(key)) {
            return res.status(400).json({ error: `Invalid key '${key}' in request body` });
        }
    }

    let productdetailC1 = {"A": 3, "B": 2, "C": 8};
    let productdetailC2 = {"D": 12, "E": 25, "F": 15};
    let productdetailC3 = {"G": 0.5, "H": 1, "I": 2};

    //Will filter the data based on input only
    const definedValuesObj = Object.fromEntries(
        Object.entries(transitData).filter(([key, value]) => (value !== undefined || value !== 0))
    );

    if (Object.keys(definedValuesObj).length > 0) {
        //This will hold the total order weight
        let weightData = {};
        for (const key in definedValuesObj) {
            const val = definedValuesObj[key];
            if (key in productdetailC1) {
                weightData.C1 = weightData.C1 ? weightData.C1 : 0;
                weightData.C1 += val * productdetailC1[key];
            }
            else if (key in productdetailC2) {
                weightData.C2 = weightData.C2 ? weightData.C2 : 0;
                weightData.C2 += val * productdetailC2[key];
            }
            else if (key in productdetailC3) {
                weightData.C3 = weightData.C3 ? weightData.C3 : 0;
                weightData.C3 += val * productdetailC3[key];
            }
        }

        distances = {
            "C1": {"L1": 3, "C2": 4, "C3": 7},
            "C2": {"L1": 2.5, "C1": 4, "C3": 3},
            "C3": {"L1": 2, "C1": 7, "C2": 3}
        };

        let unitWeightCost = {};
        for (const key in weightData) {
            if (key === 'C1') {
                unitWeightCost.C1 = calculateOutput(weightData[key]);    
            }
            if (key === 'C2') {
                unitWeightCost.C2 = calculateOutput(weightData[key]);    
            }
            if (key === 'C3') {
                unitWeightCost.C3 = calculateOutput(weightData[key]);   
            }
        }
        let route = [];
        for (const key in unitWeightCost) {
            route.push(key);
        }

        let minimumCost = calculateTotalCost(route, unitWeightCost);
        if (minimumCost) {
            res.status(200).send({minimumCost: minimumCost});
        } else {
            res.status(400).send({message: 'no response available'});
        }
    } else {
        res.status(400).send({message: 'Invalid data'});
    }
};

module.exports = { getMinimumCost };
