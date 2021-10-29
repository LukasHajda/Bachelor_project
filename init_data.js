
let nodes_positions = new Map();

let ids = cy.nodes().map(node => node.data().name);

ids.forEach(function (id, index) {
    nodes_positions.set(id, [parseInt(cy.$('#' . id).position().x), parseInt(cy.$('#' . id).position().x)]);
});
