
let nodes_positions = new Map();
let edges_info = new Map();

let ids = cy.nodes().map(node => node.data().name);
let edges = cy.edges();

edges.forEach(function (edge) {
    edges_info.set(edge.data().source + edge.data().target, edge.data().weight);
})

ids.forEach(function (id, index) {
    nodes_positions.set(id, [parseInt(cy.$('#' + id).position().x), parseInt(cy.$('#' + id).position().x)]);
});

console.log(nodes_positions);
