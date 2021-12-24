cy.on('cxttap', "node", function(event) {
    let new_edge = null;
    console.log('add edge');
    if (node_click % 2 === 1) {
        first_node = this;
    } else {
        second_node = this;
        new_edge = cy.add([
            {
                group: "edges", data: { source: first_node.data().id, target: second_node.data().id, weight: 10}
            }
        ]);
    }

    if (new_edge) {
        let vector_length = calculate_vector_length(new_edge);
        edges_info.set(first_node.data().id + second_node.data().id, [10, vector_length])
    }
    node_click++;
});