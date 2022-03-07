class Algorithm {

    #current_graph
    #queue;
    constructor(current_graph) {
        this.#current_graph = current_graph;
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
            case "Tarjan":
                this.#tarjan();
                break;
            case "Prim":
                this.#prim();
                break;
            case "Bellman-Ford":
                this.#bellman_ford();
                break;

        }

    }

    makeVisited(node) {
        node.addClass('visited');
        node.data('name', node.data().original_name + ' (visited)');
    }

    makeLVK(nodes, lkv) {
        $.each(nodes, function (index, node) {
            node.data('name', node.data().original_name + ' LKV: ' + lkv)
        })
    }

    makeComponents(nodes) {
        $.each(nodes, function (index, ele) {
            let nodes = ele.nodes();
            let component = graph.add_component();
            console.log(nodes);
            nodes.move({parent: component.data('id')});
        })
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

        let runBFSAnimation = function() {
            console.log(edgesCollection);

            let current_node = nodesCollection.shift();
            if (current_node === undefined)  {
                return;
            }

            self.makeExplored(current_node);
            real_queue.shift();
            self.#queue.text(real_queue);

            let current_node_edges = current_node.outgoers().edges().filter(function (edge) {
                return !edge.target().hasClass('visited') && !edge.target().hasClass('explored');
            });

            let length = current_node_edges.length;
            current_node_edges.each(function (edge, index) {
                edge.animate({
                    style: {
                        'line-color' : 'yellow',
                        'target-arrow-color': 'yellow'
                    },
                }, {
                    duration : 500,
                    complete : function() {
                        if (!edge.target().hasClass('visited') && !edge.target().hasClass('explored')) {
                            self.makeVisited(edge.target());
                            real_queue.push(edge.target().data().original_name);
                            self.#queue.text(real_queue);
                        }

                        if (length - 1 === index) {
                            self.#queue.text(real_queue);
                        }
                    }
                });
            });

            setTimeout(runBFSAnimation, 2000);

        }

        runBFSAnimation();

    }

    #depth_first_search() {
        let edgesCollection = [];
        let map = new Map();
        let root = system.node_select_value;
        graph.get_elements().dfs({
            roots: '#' + root,
            visit: function(v, e, u, i, depth){
                if (e !== undefined) {
                    edgesCollection.push(e);
                }
            },
            directed: true
        });

        $.each(edgesCollection, function (index, edge) {
            let source = edge.source().data().id;

            if (!map.has(source)) {
                map.set(source, [edge]);
            } else {
                let arr = map.get(source);
                arr.push(edge);
                map.set(source, arr);
            }
        });

        let current_node = root;
        let previous = [];
        let self = this;
        self.makeVisited(graph.get_specific_node(current_node));
        
        let runDFSAnimation = function() {

            if (!map.has(current_node)) {
                if (current_node === undefined) {
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
                setTimeout(runDFSAnimation, 3000);
            } else {
                edge.animate({
                    style: {
                        'line-color' : 'yellow',
                        'target-arrow-color': 'yellow'
                    }
                }, {
                    duration : 500,
                    complete : function() {
                        self.makeVisited(edge.target());
                    }
                });

                previous.push(current_node);
                current_node = edge.target().data().id;
                setTimeout(runDFSAnimation, 3000)
            }
        }
        runDFSAnimation();
    }

    #dijkstra() {

    }

    #bellman_ford() {
        let bf = graph.get_elements().bellmanFord({
            root: '#' + system.node_select_value,
            weight: function (edge) {
                console.log(edge);
            },
            directed: true
        });

        console.log(bf);

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
        let runKruskalAnimation  = function() {

            let edge_arr = sorted_edges.shift();

            if (edge_arr === undefined) {
                return;
            }

            let current_edge = edge_arr[0];

            current_edge.animate({
                css: {
                    'line-color': '#61bffc',
                    'target-arrow-color': '#61bffc',
                    'transition-property':  'line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }, {
                duration : 500,
            });
            setTimeout(runKruskalAnimation,2000);
        }

        runKruskalAnimation();

    }

    #expand_collection(nodes) {
        let new_collection = graph.make_collection();

        $.each(nodes, function (index, node) {
            let node_object = graph.get_specific_node(node);
            new_collection.merge(node_object.outgoers().edges()).merge(node_object.incomers().edges());
        })

        return new_collection;
    }


    #prim() {
        graph.change_edges_directions(false);
        let root = system.node_select_value;
        let root_object = graph.get_specific_node(root);


        let nodes_collection = [];
        let node_graphs = graph.get_elements().nodes().length;
        let result = [];

        nodes_collection.push(root);

        root_object.data().finished = 1;

        while(nodes_collection.length !== node_graphs) {
            let coll = this.#expand_collection(nodes_collection);

            let minEdge = coll.min(function(edge){
                return edge.data().weight;
            }).ele;

            while(minEdge.source().data().finished === 1 && minEdge.target().data().finished === 1) {
                coll.unmerge(minEdge);
                minEdge = coll.min(function(edge){
                    return edge.data().weight;
                }).ele;
            }
            result.push(minEdge);
            if (minEdge.source().data().finished === -1) {
                minEdge.source().data().finished = 1;
                nodes_collection.push(minEdge.source().data().id);
            }

            if (minEdge.target().data().finished === -1) {
                minEdge.target().data().finished = 1;
                nodes_collection.push(minEdge.target().data().id);
            }
        }

        let runPrimAnimation = function () {
            let current_edge = result.shift();
            if (current_edge === undefined) {
                return
            }
            current_edge.animate({
                css: {
                    'line-color': '#61bffc',
                    'target-arrow-color': '#61bffc',
                    'transition-property':  'line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }, {
                duration : 500,
            });
            setTimeout(runPrimAnimation,2000);

        }
        runPrimAnimation();

    }

    #tarjan() {
        let self = this;
        let tsc = graph.get_elements().tarjanStronglyConnected();
        let result_obj = [];
        // let component_count = 1;

        $.each(tsc.components, function (index, coll) {
            result_obj.push({
               index: index + 1,
               nodes: coll.nodes(),
               edges: coll.edges(),
            });
        });


        result_obj = result_obj.reverse();
        
        let current_obj = result_obj.pop();
        let current_edge = null;
        let lkv = 1;

        let runTarjanAnimation = function () {
            
            if (current_obj === undefined) {
                self.makeComponents(tsc.components);
                return;
            }
            current_edge = current_obj.edges.pop();

            if (current_edge === undefined) {
                self.makeLVK(current_obj.nodes, lkv);
                lkv++;
                current_obj = result_obj.pop();
                setTimeout(runTarjanAnimation, 1500);
            } else {
                current_edge.animate({
                    css: {
                        'line-color': '#61bffc',
                        'target-arrow-color': '#61bffc',
                        'transition-property':  'line-color, target-arrow-color',
                        'transition-duration': '0.5s'
                    }
                }, {
                    duration : 500,
                });
                setTimeout(runTarjanAnimation,1500);
            }

        }

        runTarjanAnimation();
    }


    #transposed_graph() {
        graph.make_transposed();
    }

    #topological_sort() {

    }

}