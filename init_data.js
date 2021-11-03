
let nodes_positions = new Map();
let edges_info = new Map();

cy.ready(function (){
    let ids = cy.nodes().map(node => node.data().name);
    let edges = cy.edges();

    ids.forEach(function (id) {
        nodes_positions.set(id, [parseInt(cy.$('#' + id).position().x), parseInt(cy.$('#' + id).position().y)]);
    });

    edges.forEach(function (edge) {
        let vector_length = calculate_vector_length(edge);
        edges_info.set(edge.data().source + edge.data().target, [edge.data().weight, vector_length]);
    })
})

function calculate_vector_length(edge) {
    let node_a = nodes_positions.get(edge.data().source);
    let node_b = nodes_positions.get(edge.data().target);

    return Math.sqrt(Math.pow(node_b[0] - node_a[0], 2) + Math.pow(node_b[1] - node_a[1], 2));
}


