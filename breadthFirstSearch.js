let n = cy.nodes();

console.log(n);
let edgesCollection = [];
let bfs = cy.elements().bfs({
    roots: '#A',
    visit: function(v, e, u, i, depth){
        edgesCollection.push(e);
        console.log(e);
    },
    directed: false
});

let path = bfs.path;
let found = bfs.found;
path.select();


let index = 0;
let length = edgesCollection.length;
function runBFSAnimation() {

    if ( index >= length ){
        clearInterval(timer);
        return;
    }

    let edge = edgesCollection[index++]
    if (edge === undefined) return;
    edge.animation({
        style: {
            'line-color' : 'black',
            'target-arrow-color': 'black'
        },
        duration: 500
    }).play();

}

let timer = setInterval(runBFSAnimation, 1000);

