let n = cy.nodes();

let edgesCollection = [];
let dfs = cy.elements().dfs({
    roots: '#A',
    visit: function(v, e, u, i, depth){
        edgesCollection.push(e);
    },
    directed: true
});

let path = dfs.path;
let found = dfs.found;
path.select();


let index = 0;
let length = edgesCollection.length;
function runDFSAnimation() {

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

let timer = setInterval(runDFSAnimation, 1000);

