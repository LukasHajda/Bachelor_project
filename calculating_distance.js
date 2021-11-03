cy.on('drag', "node", function() {
    let out_nodes = this.outgoers('edge').map(edge => [edge.data().target, edge.data().weight, edge.id()]);
    let in_nodes = this.incomers('edge').map(edge => [edge.data().source, edge.data().weight, edge.id()]);

    let merged_nodes = {out_nodes, in_nodes};

    let curr = this;
    (function () {
        calculate_distance(merged_nodes, curr);
    })();
});

function calculate_distance(nodes, current_node) {
    ['in_nodes', 'out_nodes'].forEach(function (node_type) {

        nodes[node_type].forEach(function (node) {

            let current_node_id = current_node.id();
            let current_node_posX = parseInt(current_node.position().x);
            let current_node_posY = parseInt(current_node.position().y);

            if (node[0] === current_node_id) return;

            let key = node_type === 'in_nodes' ? node[0] + current_node_id : current_node_id + node[0];

            let init_weight = edges_info.get(key)[0];
            let init_vector_length = edges_info.get(key)[1];

            let joined_node = cy.$('#' + node[0]);
            let joined_node_posX = parseInt(joined_node.position().x);
            let joined_node_posY = parseInt(joined_node.position().y);

            let new_vector_length = Math.sqrt(Math.pow(joined_node_posX - current_node_posX, 2) + Math.pow(joined_node_posY - current_node_posY, 2));

            let new_edge_weight = parseInt('' + new_vector_length * init_weight / init_vector_length);

            cy.$('#' + node[2]).css({
                 content: ''+ new_edge_weight
             });

        })
    })
}