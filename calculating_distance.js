cy.on('drag', "node", function() {
    // let incomers = this.incomers('node').filter(h => h.id() !== this.id()).map(node => node.id());
    // let outcomers = this.outgoers('node').filter(h => h.id() !== this.id()).map(node => node.id());
    let out_nodes = this.outgoers('edge').map(edge => [edge.data().target, edge.data().weight, edge.id()]);
    let in_nodes = this.incomers('edge').map(edge => [edge.data().source, edge.data().weight, edge.id()]);

    // console.log(out_nodes);
    // console.log(cy.$('#' + out_nodes[0][2]));
    // console.log(cy.$('#' + out_nodes[0][2]).data().weight);
    //
    // // TODO BOZSKY PRIKAZ
    // // cy.$('#' + out_nodes[0][2]).css({
    // //     content: ''+ 100
    // // });
    //
    //
    // console.log(cy.$('#' + out_nodes[0][2]).data().weight);


    let merged_nodes = {out_nodes, in_nodes};

    // TODO: Globalne si zapamatat pocitacone hodnoty hran a od tychto hodnot prepocitavat vektory
    // TODO: spocitat si vektor pre kazdy bod
    // TODO:
    // TODO: priama umera
    let curr = this;
    (function () {
        calculate_distance(merged_nodes, curr.position().x, curr.position().y, curr.id());
    })();
    
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

function calculate_distance(nodes, posX, posY, current_id) {
    // let x = 'in_nodes';
    // console.log(nodes[x]);
    ['in_nodes', 'out_nodes'].forEach(function (node_type) {
        nodes[node_type].forEach(function (node) {
            console.log(node[0], current_id);
            let x = nodes_positions.get(node[0])[0];
            let y = nodes_positions.get(node[0])[1];

            let curr_x = nodes_positions.get(current_id)[0];
            let curr_y = nodes_positions.get(current_id)[1];

            let key = node_type === 'in_nodes' ? node[0] + current_id : current_id + node[0];
            
            // console.log(key);

            let weight_main = edges_info.get(key);
            // console.log(weight_main);
            let a = (x - curr_x) * (x - curr_x);
            let b = (y - curr_y) * (y - curr_y);
            
            console.log(a, b);

            // console.log(curr_x);
            let vector_length_main = Math.sqrt(a + b);
            // console.log(vector_length_main);

            let new_vector_length = Math.sqrt(Math.pow(x - posX, 2) + Math.pow(y - posY, 2));
            // console.log(new_vector_length, weight_main, vector_length_main);

            let new_edge_weight = parseInt(new_vector_length * weight_main / vector_length_main);


            cy.$('#' + node[2]).css({
                 content: ''+ new_edge_weight
             });

            console.log(new_edge_weight);
        })
    })
        // nodes[edge_type].forEach(function (node) {
        //     console.log(node);
        // })
        // for (let data in nodes[edge_type]) {
        //     console.log('dddd');
        //     console.log(data[0]);
        //     let x = nodes_positions[data[0]][0];
        //     let y = nodes_positions[data[0]][1];
        //     let weight = data[1];
        //
        //     let vector_length = Math.sqrt(Math.pow(x - posX, 2) + Math.pow(y - posY, 2));
        //
        //     nodes_positions[current_id][0] = x;
        //     nodes_positions[current_id][1] = y;
        // }
}

// function calculate()