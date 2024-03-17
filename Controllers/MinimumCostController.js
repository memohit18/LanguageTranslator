
function generateRoutes(centers, currentRoute, routes) {
    if (centers.length === 0) {
        routes.push(currentRoute.slice()); // Add the current route to the routes array
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


function calculateTotalCost(route,totalweightcost) {
    let totalCost = [];
    let L1Cost = 10
    // Calculate cost from starting point to the first center
    let distance = {
        c1c2 : 4,
        c1l1 : 3,
        c2l1 : 2.5,
        c3l1 : 2,
        c2c3 : 3
    }
    //Incase of single delivery
    if (route.length == 1 ){
        if(route[0] == 'C1'){
            totalCost.push(totalweightcost['C1'] * distance.c1l1)
        }
        else if(route[0] == 'C2'){
            totalCost.push(totalweightcost['C2'] * distance.c2l1)
        }
        else if(route[0] == 'C3'){
            totalCost.push(totalweightcost['C3'] * distance.c3l1)
        }
    }
    
    if (route.length == 2 ){
        //incase 2 center is used
        // && ((element == 'C2' && element == 'C3') || (element == 'C3' && element == 'C1')
        if (route[0] == 'C1' && route[1] == 'C2'){
            const possibleRoutes = getAllPossibleRoutes(route);
            let mini = 999999999
            for (let index = 0; index < possibleRoutes.length; index++) {
                let min = 99999999
                const location = possibleRoutes[index];
                let actualTotal = 0
                for (let j = 0; j < location.length; j++) {
                    let currentTotal = 0 
                    let currentPostition = location[j]
                    let oldposition = location[j-1
                    ]
                    if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1l1 * totalweightcost['C1']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C2'){
                        currentTotal += distance.c2l1 * L1Cost
                    }else if(currentPostition == 'L1' && location[j+1] == 'C1'){
                        currentTotal += distance.c1l1 * L1Cost
                    }else if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1l1 * totalweightcost['C1']
                    }else if(currentPostition == 'C2' && location[j+1] == 'L1'){
                        currentTotal += distance.c2l1 * totalweightcost['C2']
                    }else if(currentPostition == 'C1' && location[j+1] == 'C2'){
                        currentTotal += distance.c1c2 * totalweightcost['C1']
                    }else if(currentPostition == 'C2' && location[j+1] == 'C1'){
                        currentTotal += distance.c1c2 * totalweightcost['C2']
                    }
                    actualTotal += currentTotal
                }
                mini = Math.min(actualTotal,min)
                totalCost.push(mini)    
            }
        }else if(route[0] == 'C2' && route[1] == 'C3'){
            const possibleRoutes = getAllPossibleRoutes(route);
            let mini = 999999999
            for (let index = 0; index < possibleRoutes.length; index++) {
                let min = 99999999
                const location = possibleRoutes[index];
                let actualTotal = 0
                for (let j = 0; j < location.length; j++) {
                    let currentTotal = 0 
                    let currentPostition = location[j]

                    if(currentPostition == 'C2' && location[j+1] == 'L1'){
                        currentTotal += distance.c2l1 * totalweightcost['C2']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C3'){
                        currentTotal += distance.c3l1 * L1Cost
                    }else if(currentPostition == 'L1' && location[j+1] == 'C2'){
                        currentTotal += distance.c3l1 * L1Cost
                    }else if(currentPostition == 'C3' && location[j+1] == 'L1'){
                        currentTotal += distance.c3l1 * totalweightcost['C3']
                    }else if(currentPostition == 'C2' && location[j+1] == 'L1'){
                        currentTotal += distance.c2l1 * totalweightcost['C2']
                    }else if(currentPostition == 'C3' && location[j+1] == 'C2'){
                        currentTotal += distance.c2c3 * totalweightcost['C3']
                    }else if(currentPostition == 'C2' && location[j+1] == 'C3'){
                        currentTotal += distance.c2c3 * totalweightcost['C2']
                    }
                    actualTotal += currentTotal
                }
                mini = Math.min(actualTotal,min)
                totalCost.push(mini)    
            }
        }else if(route[0] == 'C1' && route[1] == 'C3'){
            let possibleRoutes = getAllPossibleRoutes(route);

            const filteredRoutes = possibleRoutes.filter(route => {
                const indexC1 = route.indexOf('C1');
                const indexC3 = route.indexOf('C3');
                return !(indexC1 !== -1 && indexC3 !== -1 && Math.abs(indexC1 - indexC3) === 1);
            })
            let mini = 999999999
            for (let index = 0; index < filteredRoutes.length; index++) {
                let min = 99999999
                const location = filteredRoutes[index];
                let actualTotal = 0
                for (let j = 0; j < location.length; j++) {
                    let currentTotal = 0 
                    let currentPostition = location[j]
                    if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1l1 * totalweightcost['C1']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C1'){
                        currentTotal += distance.c1l1 * L1Cost
                    }else if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1
                        l1 * totalweightcost['C1']
                    }else if(currentPostition == 'C3' && location[j+1] == 'L1'){
                        currentTotal += distance.c3l1 * totalweightcost['C3']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C1'){
                        currentTotal += distance.c3l1 * L1Cost
                    }else if(currentPostition == 'L1' && location[j+1] == 'C3'){
                        currentTotal += distance.c3l1 * L1Cost
                    }
                    if(currentTotal != 0){
                        actualTotal += currentTotal
                    }

                }
                mini = Math.min(actualTotal,min)
                totalCost.push(mini)  
            
            }
        }
    }
    if (route.length == 3){
        //incase 3 center are used
        if (route[0] == 'C1' && route[1] == 'C2' && route[2] == 'C3'){
            let possibleRoutes = getAllPossibleRoutes(route);

            const filteredRoutes = possibleRoutes.filter(route => {
                const indexC1 = route.indexOf('C1');
                const indexC3 = route.indexOf('C3');
                return !(indexC1 !== -1 && indexC3 !== -1 && Math.abs(indexC1 - indexC3) === 1);
            })


            for (let index = 0; index < filteredRoutes.length; index++) {
                let min = 99999999
                const location = filteredRoutes[index];
                let actualTotal = 0
                for (let j = 0; j < location.length; j++) {
                    let currentTotal = 0 
                    let currentPostition = location[j]
                    if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1l1 * totalweightcost['C1']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C2'){
                        currentTotal += distance.c2l1 * L1Cost
                    }else if(currentPostition == 'L1' && location[j+1] == 'C1'){
                        currentTotal += distance.c1l1 * L1Cost
                    }else if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1l1 * totalweightcost['C1']
                    }else if(currentPostition == 'C2' && location[j+1] == 'L1'){
                        currentTotal += distance.c2l1 * totalweightcost['C2']
                    }else if(currentPostition == 'C1' && location[j+1] == 'C2'){
                        currentTotal += distance.c1c2 * totalweightcost['C1']
                    }else if(currentPostition == 'C2' && location[j+1] == 'C1'){
                        currentTotal += distance.c1c2 * totalweightcost['C2']
                    }else if(currentPostition == 'C2' && location[j+1] == 'L1'){
                        currentTotal += distance.c2l1 * totalweightcost['C2']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C3'){
                        currentTotal += distance.c3l1 * L1Cost
                    }else if(currentPostition == 'L1' && location[j+1] == 'C2'){
                        currentTotal += distance.c3l1 * L1Cost
                    }else if(currentPostition == 'C3' && location[j+1] == 'L1'){
                        currentTotal += distance.c3l1 * totalweightcost['C3']
                    }else if(currentPostition == 'C2' && location[j+1] == 'L1'){
                        currentTotal += distance.c2l1 * totalweightcost['C2']
                    }else if(currentPostition == 'C3' && location[j+1] == 'C2'){
                        currentTotal += distance.c2c3 * totalweightcost['C3']
                    }else if(currentPostition == 'C2' && location[j+1] == 'C3'){
                        currentTotal += distance.c2c3 * totalweightcost['C2']
                    }else if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1l1 * totalweightcost['C1']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C1'){
                        currentTotal += distance.c1l1 * L1Cost
                    }else if(currentPostition == 'C1' && location[j+1] == 'L1'){
                        currentTotal += distance.c1l1 * totalweightcost['C1']
                    }else if(currentPostition == 'C3' && location[j+1] == 'L1'){
                        currentTotal += distance.c3l1 * totalweightcost['C3']
                    }else if(currentPostition == 'L1' && location[j+1] == 'C1'){
                        currentTotal += distance.c3l1 * L1Cost
                    }else if(currentPostition == 'L1' && location[j+1] == 'C3'){
                        currentTotal += distance.c3l1 * L1Cost
                    }
                    actualTotal += currentTotal
                }
                mini = Math.min(actualTotal,min)
                totalCost.push(mini)    
            }
        }

    }

    return Math.min(...totalCost)
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
    let transitData = req.body

     // Validate keys
    const validKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const requestData = req.body;

    for (const key in requestData) {
        if (!validKeys.includes(key)) {
            return res.status(400).json({ error: `Invalid key '${key}' in request body` });
        }
    }

    let productdetailC1 = {"A": 3, "B": 2, "C": 8}
    let productdetailC2 = {"D": 12, "E": 25, "F": 15}
    let productdetailC3 = {"G": 0.5, "H": 1, "I": 2}

    //Will filter the data based on input only
    const definedValuesObj = Object.fromEntries(
        Object.entries(transitData).filter(([key, value]) => (value !== undefined || value !== 0))
    )

    if(Object.keys(definedValuesObj).length > 0){
        //This will hold the total order weight
        let wightData = {}
        for (const key in definedValuesObj) {
            val = definedValuesObj[key];
            if (key in productdetailC1){
                wightData.C1 = wightData.C1 ? wightData.C1 : 0
                wightData.C1 += val * productdetailC1[key]
            }
            else if (key in productdetailC2){
                wightData.C2 = wightData.C2 ? wightData.C2 : 0
                wightData.C2 += val * productdetailC2[key]
            }
            else if (key in productdetailC3){
                wightData.C3 = wightData.C3 ? wightData.C3 : 0
                wightData.C3 += val * productdetailC3[key]
            }
        }

        distances = {
            "C1": {"L1": 3, "C2": 4, "C3": 7},
            "C2": {"L1": 2.5, "C1": 4, "C3": 3},
            "C3": {"L1": 2, "C1": 7, "C2": 3}
        }

        let unitwightCost = {}
        for (const key in wightData) {
            if (key == 'C1'){
                unitwightCost.C1 = calculateOutput(wightData[key])    
            }
            if (key == 'C2'){
                unitwightCost.C2 = calculateOutput(wightData[key])    
            }
            if (key == 'C3'){
                unitwightCost.C3 = calculateOutput(wightData[key])   
            }
        }
        let route = []
        for (const key in unitwightCost) {
            route.push(key)
        }

        let minimumcost = calculateTotalCost(route,unitwightCost)
        if(minimumcost){
            res.status(200).send({minimumcost:minimumcost})
        }else{
            res.status(400).send({message: 'no response available'})
        }
    }else{
        invalidData
    }

    

    
};

module.exports = { getMinimumCost };