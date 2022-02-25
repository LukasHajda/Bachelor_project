let bf = cy.elements().bellmanFord({
    root: "#A",
    directed: true,
    weight: function(edge) {
        return edge.data().weight
    }
});
console.log(bf.hasNegativeWeightCycle);
// TODO pcekovat ci je negativny cyklus ..ak neni tak pusti animaciu
// let result = bf.pathTo('#H');
// console.log(bf.negativeWeightCycles);
// let result = bf.pathTo('#H');
// let edges = result.edges();
//
// let index = 0;
// let length = edges.length;

// function runBellmanFord() {
//
//     if ( index >= length ){
//         clearInterval(timer);
//         return;
//     }
//
//     let edge = edges[index++]
//     if (edge === undefined) return;
//     edge.animation({
//         style: {
//             'line-color' : 'black',
//             'target-arrow-color': 'black'
//         },
//         duration: 500
//     }).play();
//
// }

// let timer = bf.hasNegativeWeightCycle ? null : setInterval(runBellmanFord, 1000);



