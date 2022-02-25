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
        console.log(algo_name);
        switch (algo_name) {
            case "BFS":
                this.#breadth_first_search();
                break;
            case "DFS":
                this.#depth_first_search();
                break;
            case "Kruskal":
                this.#kruskal();
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

    #breadth_first_search() {

        let edgesCollection = [];
        let nodesCollection = [];
        graph.get_elements().bfs({
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

    }

    #depth_first_search() {
        let edgesCollection = [];
        let nodesCollection = [];
        let map = new Map();
        let root = system.node_select_value;
        graph.get_elements().dfs({
            roots: '#' + root,
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

        $.each(edgesCollection, function (index, edge) {
            console.log(edge);
            let source = edge.source().data().id;

            if (!map.has(source)) {
                map.set(source, [edge]);
            } else {
                let arr = map.get(source);
                arr.push(edge);
                map.set(source, arr);
            }
        });
        
        console.log(map);
        let current_node = root;
        let previous = [];
        let self = this;
        self.#is_paused = false;
        self.makeVisited(graph.get_specific_node(current_node));
        
        function runDFSAnimation() {
            self.#is_paused = true;
            
            console.log(previous);

            if (!map.has(current_node)) {
                if (current_node === undefined) {
                    clearInterval(timer);
                    return;
                }
                self.makeExplored(graph.get_specific_node(current_node));
                current_node = previous.pop();
            }


            let edge = map.get(current_node).shift();
            let node_object = graph.get_specific_node(current_node);

            if (edge === undefined) {
                self.makeExplored(node_object);
                current_node = previous.pop();
                self.#is_paused = false;
                return;
            }

            edge.delay(1500).animate({
                style: {
                    'line-color' : 'yellow',
                    'target-arrow-color': 'yellow'
                }
            }, {
                duration : 800,
                complete : function() {
                    self.makeVisited(edge.target());
                    self.#is_paused = false;
                }
            });

            previous.push(current_node);
            current_node = edge.target().data().id;


        }
        
        let timer = setInterval(function () {
            console.log('sdsdssd');
            if (!self.#is_paused) {
                runDFSAnimation();
            }
        }, 1000);

    }

    #dijkstra() {

    }

    #bellman_ford() {

    }

    sorting(sorted_edges) {
        return sorted_edges.sort(function (edge1, edge2) {
            return edge1[1] - edge2[1];
        });
    }

    #kruskal() {
        let nodes = graph.get_elements().nodes();
        let test = graph.get_elements().edges().sort(function (edge1, edge2) {
            return edge1.data().weight - edge2.data().weight;
        })

        $.each(test, function (index, edge) {
            nodes.push(edge);
        })

        let sorted_edges = nodes.kruskal().edges().map(edge => [edge, edge.data().weight]);

        let self = this;
        function runKruskalAnimation() {
            self.#is_paused = true;

            let edge_arr = sorted_edges.shift();

            if (edge_arr === undefined) {
                clearInterval(timer);
                return;
            }

            let current_edge = edge_arr[0];
            
            console.log(current_edge.source().data().name, current_edge.target().data().name);

            current_edge.delay(1500).animate({
                style: {
                    'line-color' : 'yellow',
                    'target-arrow-color': 'yellow'
                }
            }, {
                duration : 800,
                complete : function() {
                    self.#is_paused = false;
                }
            });

        }


        let timer = setInterval(function () {
            console.log('sdsdssd');
            if (!self.#is_paused) {
                runKruskalAnimation();
            }
        }, 1000);






        // console.log(sorted_edges.map(edge => [edge.source().data().name, edge.target().data().name, edge.data().weight]));

    }

    #prim() {

    }

    kos_sharir() {

    }

    #topological_sort() {

    }

}