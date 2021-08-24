cy.on('drag', "node", function() {
    // let incomers = this.incomers('node').filter(h => h.id() !== this.id()).map(node => node.id());
    // let outcomers = this.outgoers('node').filter(h => h.id() !== this.id()).map(node => node.id());
    let e = this.connectedEdges(); // Dostanem vsetky hrany (in aj out)
        console.log(e);
    // console.log(incomers);
    // console.log(outcomers);

    // calculate_distance([incomers, outcomers], this);
});

// function calculate_distance(nodes_arr, given_node) {
//     for (let set_nodes in nodes_arr) {
//         for (let nodes in set_nodes) {
//
//         }
//     }
// }

// function calculate()