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

    makeVisited(node) {
        node.addClass('visited');
        node.data('name', node.data().original_name + ' (visited)');
    }

    makeExplored(node) {
        node.removeClass('visited');
        node.addClass('explored');
        node.data('name', node.data().original_name + ' (explored)');
    }

    removeToggle(node) {
        node.removeClass('custom-border');
    }

    my_bfs() {
        let root = this.#current_graph.$('#' + system.node_select_value);
        console.log(root.outgoers());

        let queue = [];
        let node_path = [];
        root.data().visited = true;
        queue.push(root);
        node_path.push(root);

        while (queue.length !== 0) {
            let currentVertex = queue.shift();

            let nextNodes = currentVertex.outgoers().nodes();

            $.each(nextNodes, function (index, node) {
                console.log(node.data().id);
                if (!node.data().visited) {
                    node.data().visited = true;
                    queue.push(node);
                    node_path.push(node);
                }
            })
        }

        this.#current_graph.nodes().map(node => node.data().visited = false);

        return node_path;

    }




    #breadth_first_search() {

        let nodesCollection = this.my_bfs();
        console.log(nodesCollection.map(node => node.data().id));
        let index = 0;
        let length = nodesCollection.length;


        let self = this;

        function runBFSAnimation() {

            let current_node = nodesCollection.shift();
            if (current_node === undefined) return;

            self.makeExplored(current_node);

            let current_node_edges = current_node.outgoers().edges().filter(function (edge) {
                return !edge.target().hasClass('visited') && !edge.target().hasClass('explored');
            });

            let current_node_nodes = current_node.outgoers().nodes().filter(function (node) {
                return !node.hasClass('visited') && !node.hasClass('explored');
            });

            $.each(current_node_nodes, function (index, node) {
                self.makeVisited(node);
            })

            console.log(current_node_edges.map(edge => [edge.source().data().id, edge.target().data().id]));

            $.each(current_node_edges, function (index, edge) {
                edge.animation({
                    style: {
                        'line-color' : 'black',
                        'target-arrow-color': 'black'
                    },
                    duration: 700
                }).play();
            })


        }

        let timer = setInterval(runBFSAnimation, 2000);
    }
    //     let n = this.#current_graph.nodes();
    //
    //     let edgesCollection = [];
    //     let bfs = this.#current_graph.elements().bfs({
    //         roots: '#' + system.node_select_value,
    //         visit: function(v, e, u, i, depth){
    //             console.log(u);
    //             if (e !== undefined) {
    //                 edgesCollection.push(e);
    //             }
    //         },
    //         directed: true
    //     });
    //
    //     let index = 0;
    //     let length = edgesCollection.length;
    //     let current_node = edgesCollection[0] !== undefined ? edgesCollection[0].source() : null;
    //     let previous_node = edgesCollection[0] !== undefined ? edgesCollection[0].source() : null;
    //     this.makeExplored(current_node);
    //     // console.log(edgesCollection[0] === undefined);
    //     // return;
    //
    //     let self = this;
    //     function runBFSAnimation() {
    //
    //         // console.log(current_node);
    //
    //         if ( index >= length ){
    //             clearInterval(timer);
    //             return;
    //         }
    //
    //         let edge = edgesCollection[index++]
    //         if (edge === undefined) return;
    //
    //         current_node = edge.source();
    //         let target_node = edge.target();
    //         self.makeVisited(target_node);
    //
    //         if (current_node.data().id !== previous_node.data().id) {
    //             console.log('sdsdsdsd');
    //             self.makeExplored(current_node);
    //         }
    //
    //         previous_node = current_node;
    //
    //         // toggleSelectedElements(current_node);
    //
    //         edge.animation({
    //             style: {
    //                 'line-color' : 'black',
    //                 'target-arrow-color': 'black'
    //             },
    //             duration: 500
    //         }).play();
    //
    //     }
    //
    //     let timer = setInterval(runBFSAnimation, 4000);
    // }

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