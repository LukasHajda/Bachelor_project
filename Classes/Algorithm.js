class Algorithm {

    #current_graph
    constructor(current_graph) {
        this.#current_graph = current_graph;
    }

    call_algorithm(algo_name) {
        switch (algo_name) {
            case "BFS":
                this.#breadth_first_search();
                break;
            case "DFS":
                this.#depth_first_search();
                break;
        }

    }




    #breadth_first_search() {
        let n = this.#current_graph.nodes();

        let edgesCollection = [];
        let bfs = this.#current_graph.elements().bfs({
            roots: '#A',
            visit: function(v, e, u, i, depth){
                edgesCollection.push(e);
            },
            directed: true
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
    }

    #depth_first_search() {
        let n = this.#current_graph.nodes();

        let edgesCollection = [];
        let dfs = this.#current_graph.elements().dfs({
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
    }

    #dijkstra() {

    }

    #bellman_ford() {

    }

    #kruskal() {

    }

    #prim() {

    }

    kos_sharir() {

    }

    #topological_sort() {

    }

}