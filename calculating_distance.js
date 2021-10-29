cy.on('drag', "node", function() {
    // let incomers = this.incomers('node').filter(h => h.id() !== this.id()).map(node => node.id());
    // let outcomers = this.outgoers('node').filter(h => h.id() !== this.id()).map(node => node.id());
    let out_nodes = this.outgoers('edge').map(edge => [edge.data().target, edge.data().weight]);
    let in_nodes = this.incomers('edge').map(edge => [edge.data().target, edge.data().weight]);

    let merged_nodes = {out_nodes, in_nodes};
    console.log(merged_nodes['in_nodes']);

    // TODO: Globalne si zapamatat pocitacone hodnoty hran a od tychto hodnot prepocitavat vektory
    // TODO: spocitat si vektor pre kazdy bod
    // TODO:
    // TODO: priama umera
    
    // console.log(this.position().y, this.position().x);
    
    // console.log('=== IN ===');
    // for (const n of in_nodes) {
    //     console.log(n.data('weight'));
    // }
    //
    // console.log('=== OUT ===');
    // for (const n of out_nodes) {
    //     console.log(n.data('weight'));
    // }
    // console.log(incomers);
    // console.log(outcomers);

    // calculate_distance([incomers, outcomers], this);
});

function calculate_distance(nodes, posX, posY) {
    for (let edge_type in ['in_nodes', 'out_nodes']) {
        for (let data in nodes[edge_type]) {
            let x = nodes_positions[data[0]][0];
            let y = nodes_positions[data[0]][1];
            let weight = data[1];

            let vector_length = Math.sqrt(Math.pow(x - posX, 2) + Math.pow(y - posY, 2));




        }
    }
}

// function calculate()