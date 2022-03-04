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
            case "Kosararu sharir":
                this.#kos_sharir();
                break;
            case "Prim":
                this.#prim();
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

    #first_dfs(root) {
        let edgesCollection = [];
        let visited = [];
        while(root !== undefined) {
            // console.log('Prave odhaluje z:', root);
            if (!visited.includes(root)) {
                visited.push(root)
            }
            graph.get_elements().dfs({
                roots: '#' + root,
                visit: function(v, e, u, i, depth){
                    if (e !== undefined) {
                        if (!visited.includes(e.target().data().id)) {
                            edgesCollection.push(e);
                            visited.push(e.target().data().id)
                        }
                    }
                    if (v !== undefined) {
                        v.data().discovered = 1;
                    }
                },
                directed: true
            });

            root = graph.get_undiscovered_nodes().pop();
            // console.log(root);
        }

        console.log(edgesCollection.map(edge => [edge.source().data().id, edge.target().data().id]));

        return edgesCollection;
    }

    #make_timestamps(map, original) {
        let time = 1;
        let time_stamps = map;
        let previous_time = [];
        let current_node_time = original;
        let node = null;
        let br = 0;
        console.log('VSTUP MAPA:', map);
        while (true) {
            br = true;
            while(current_node_time !== undefined) {
                node = graph.get_specific_node(current_node_time);

                console.log(node.data().name, time);

                if (node.data().discovered === -1) {
                    node.data().discovered = time;
                    time++;
                }

                let data = time_stamps.get(current_node_time);

                if (data === undefined || data === []) {
                    if (node.data().finished !== -1) break;
                    node.data().finished = time;
                    time++;

                    current_node_time = previous_time.pop();
                } else {
                    let edge = time_stamps.get(current_node_time).shift();

                    if (edge === undefined) {
                        node = graph.get_specific_node(current_node_time);
                        if (node.data().finished === -1) {
                            node.data().finished = time;
                            time++;
                        }
                        current_node_time = previous_time.pop();
                    } else {
                        previous_time.push(current_node_time);
                        current_node_time = edge.target().data().id;
                    }
                }
            }

            for (const [key, value] of time_stamps.entries()) {
                if (value.length !== 0) {
                    console.log('Nejaka noda', key);
                    current_node_time = key;
                    br = false;
                    break;
                }
            }

            if (br) break;

        }
    }

    #runReversedDDFS_main(sorted) {

        console.log(sorted.map(node => [node.data().id, node.data().discovered, node.data().finished]));

        let current = sorted.pop();
        let no = [];
        let runReversedDDFS = function () {

            while (current !== undefined) {
                let tmp = [];
                graph.get_elements().dfs({
                    roots: '#' + current.data().id,
                    visit: function(v, e, u, i, depth){
                        if (v !== undefined && v.data().reversed !== 1) {
                            tmp.push(v);
                            v.data().reversed = 1;
                        }
                    },
                    directed: true
                });
                if (tmp.length !== 0) {
                    no.push(tmp);
                }
                current = sorted.pop();
            }

        }
        runReversedDDFS();
        let runReversedAnimation = function () {
            $.each(no, function (index, arr) {
                let component = graph.add_component();

                $.each(arr, function (index, node) {
                    console.log(node);
                    node.move({parent: component.data('id')})
                })
            })
        }
        runReversedAnimation();
    }

    #kos_sharir() {
        let map = new Map();
        let time_stamps = new Map();
        let root = system.node_select_value;
        let original = root;

        let edgesCollection = this.#first_dfs(root);
        graph.reset_configuration();

        $.each(edgesCollection, function (index, edge) {
            let source = edge.source().data().id;

            if (!map.has(source)) {
                // map.set(source, [edge]);
                map.set(source, [edge]);
            } else {
                let arr = map.get(source);
                arr.push(edge);
                map.set(source, arr);
            }

            if (!time_stamps.has(source)) {
                time_stamps.set(source, [edge]);
            } else {
                let arr = time_stamps.get(source);
                arr.push(edge);
                time_stamps.set(source, arr);
            }
        });

        let nodes = graph.get_nodes().map(node => node.data().id);

        $.each(nodes, function (index, node) {
            if (!map.has(node)) {
                map.set(node, [undefined]);
            }

            if (!time_stamps.has(node)) {
                time_stamps.set(node, [undefined]);
            }
        })


        // console.log(map);
        // return;

        let time = 1;
        let current_node = original;
        let previous = [];
        let self = this;
        let unconnected = false;

        let runKosarajuAnimation = function() {
            console.log('Prave animujem:', current_node);
            let node_object = graph.get_specific_node(current_node);

            if (current_node !== undefined && !node_object.hasClass('visited')) {
                self.makeVisited(node_object);
            }

            unconnected = false;
            if (!map.has(current_node)) {
                if (current_node === undefined) {
                    for (const [key, value] of map.entries()) {
                        if (value.length !== 0) {
                            current_node = key;
                            self.makeExplored(graph.get_specific_node(current_node));
                            unconnected = true;
                            break;
                        }
                    }

                }

                if (!unconnected) {
                    if (current_node === undefined) {
                        graph.reset_configuration();
                        graph.make_transposed();
                        self.#make_timestamps(time_stamps, original)
                        let sorted = graph.sorted_by_finished();
                        self.#runReversedDDFS_main(sorted);
                        return;
                    }
                    self.makeExplored(graph.get_specific_node(current_node));
                    current_node = previous.pop();
                }
            }

            let edge = current_node === undefined ? undefined : map.get(current_node).shift();
            node_object = graph.get_specific_node(current_node);

            if (edge === undefined) {
                if (current_node !== undefined) {
                    self.makeExplored(node_object);
                    graph.change_time(node_object.data().id, false, time);
                    time++;
                }
                current_node = previous.pop();
                setTimeout(runKosarajuAnimation, 500);
            } else {
                if (!edge.target().hasClass('explored')) {
                    edge.animate({
                        style: {
                            'line-color' : 'yellow',
                            'target-arrow-color': 'yellow'
                        }
                    }, {
                        duration : 200,
                        complete : function() {
                            graph.change_time(edge.target().data().id, true, time);
                            time++;
                            self.makeVisited(edge.target());
                        }
                    });
                }
                previous.push(current_node);
                current_node = edge.target().data().id;
                setTimeout(runKosarajuAnimation, 500)
            }
        }
        runKosarajuAnimation();

    }


    #transposed_graph() {
        graph.make_transposed();
    }

    #topological_sort() {

    }

}