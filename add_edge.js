cy.on('cxttap', "node", function(event) {
    console.log('add edge');
    if (node_click % 2 === 1) {
        first_node = this;
    } else {
        second_node = this;
        cy.add([
            {
                group: "edges", data: { source: first_node.data().id, target: second_node.data().id, weight: 10}
            }
        ])
    }
    node_click++;
});