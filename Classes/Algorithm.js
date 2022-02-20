class Algorithm {

    #current_graph
    #is_paused;
    #queue;
    constructor(current_graph) {
        this.#current_graph = current_graph;
        this.#is_paused = false;
        this.#queue = $('.queue');
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

        let edgesCollection = [];
        let nodesCollection = [];
        let bfs = graph.get_elements().bfs({
            roots: '#' + system.node_select_value,
            visit: function(v, e, u, i, depth){
                if (e !== undefined) {
                    edgesCollection.push(e);
                }

                if (v !== undefined) {
                    nodesCollection.push(v);
                }
            },
            directed: true
        });

        let self = this;
        let real_queue = [];

        if (nodesCollection[0] !== undefined) {
            real_queue.push(nodesCollection[0].data().original_name);
        }

        self.#queue.text(real_queue);

        function runBFSAnimation() {
            console.log(edgesCollection);

            self.#is_paused = true;

            let current_node = nodesCollection.shift();
            console.log(current_node);
            if (current_node === undefined)  {
                clearInterval(timer);
                return;
            }

            self.makeExplored(current_node);
            real_queue.shift();
            self.#queue.text(real_queue);

            let current_node_edges = current_node.outgoers().edges().filter(function (edge) {
                return !edge.target().hasClass('visited') && !edge.target().hasClass('explored');
            });

            let length = current_node_edges.length;
            if (length === 0) {
                self.#is_paused = false;
            }
            current_node_edges.each(function (edge, index) {
                edge.delay(1500).animate({
                    style: {
                        'line-color' : 'yellow',
                        'target-arrow-color': 'yellow'
                    },
                }, {
                    duration : 800,
                    complete : function() {
                        if (!edge.target().hasClass('visited') && !edge.target().hasClass('explored')) {
                            self.makeVisited(edge.target());
                            real_queue.push(edge.target().data().original_name);
                            self.#queue.text(real_queue);
                        }

                        if (length - 1 === index) {
                            self.#queue.text(real_queue);
                            self.#is_paused = false;
                        }

                    }
                });
            });

        }

        let timer = setInterval(function () {
            if (!self.#is_paused) {
                runBFSAnimation();

            }
        }, 1000);

        // let nodesCollection = this.my_bfs();
        // let self = this;
        // let real_queue = nodesCollection.map(node => node.data().original_name);
        // let iteration = 1;
        // let visited = 0;
        //
        // function runBFSAnimation() {
        //
        //     self.#is_paused = true;
        //
        //     let current_node = nodesCollection.shift();
        //     if (current_node === undefined)  {
        //         clearInterval(timer);
        //         return;
        //     }
        //
        //     self.#queue.text(real_queue.slice(iteration));
        //
        //     self.makeExplored(current_node);
        //
        //     let current_node_edges = current_node.outgoers().edges().filter(function (edge) {
        //         return !edge.target().hasClass('visited') && !edge.target().hasClass('explored');
        //     });
        //
        //     let length = current_node_edges.length;
        //     if (length === 0) {
        //         real_queue.shift();
        //         self.#queue.text(real_queue);
        //         self.#is_paused = false;
        //     }
        //     current_node_edges.each(function (edge, index) {
        //         edge.delay((index + 1) * 1200).animate({
        //             style: {
        //                 'line-color' : 'yellow',
        //                 'target-arrow-color': 'yellow'
        //             },
        //         }, {
        //             duration : 1000,
        //             complete : function() {
        //                 if (!edge.target().hasClass('visited') && !edge.target().hasClass('explored')) {
        //                     self.makeVisited(edge.target());
        //                     real_queue.push(edge.target().data().original_name);
        //                     self.#queue.text(real_queue);
        //                 }
        //
        //                 if (length - 1 === index) {
        //                     real_queue.shift();
        //                     self.#queue.text(real_queue);
        //                     self.#is_paused = false;
        //                 }
        //
        //             }
        //         });
        //     });
        // }
        //
        // let timer = setInterval(function () {
        //     if (!self.#is_paused) {
        //         runBFSAnimation();
        //
        //     }
        // }, 2500);
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