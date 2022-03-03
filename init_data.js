let graph = new Graph(cy);
let system = new System();

$('#backgroundColor-first').val('#e2d0d0');
$('#backgroundColor-second').val('#949995');
$('#color4').val('#83b55a');
$('#color3').val('#a83030');

$('#clear_edges').click(function () {
    graph.clear_edges();
});

$('#clear_graph').click(function () {
    graph.clear_graph(); // done
});

$('#reset_configuration').click(function () {
    graph.reset_configuration(); // Done
    system.reset_configuration();
})

$('#remove_selected').click(function () {
    graph.remove_selected_elements() // done
})

$('#color5').on('change', function () {
    graph.change_selected_elements_color(); // done
})

$('#make_component').on('click', function () {
   graph.make_component(); // done
});

$('#change_element').on('click', function () {
    graph.change_text(); // done
})

$('#change_edge').on('click', function () {
    graph.change_text_edge();
})

$('#select_all_edges').on('click', function () {
   graph.select_all_edges();
});

$('#select_all_nodes').change(function () {
    graph.select_all_nodes();
});

$('#play').on('click', function () {
    let selected_algo = $('#algorithm-select option:selected').val()
    graph.run_algorithm(selected_algo);
});

$('#discovered').on('click', function () {
   graph.show_time();
   //  graph.make_transposed();
});



// let click_count = 0;
// let nodes_positions = new Map();
// let edges_info = new Map();
//
// $('#color4').val('#83b55a');
// $('#color3').val('#a83030');
//
// cy.ready(function (){
//     let ids = cy.nodes().map(node => node.data().name);
//     let edges = cy.edges();
//
//     ids.forEach(function (id) {
//         nodes_positions.set(id, [parseInt(cy.$('#' + id).position().x), parseInt(cy.$('#' + id).position().y)]);
//     });
//
//     edges.forEach(function (edge) {
//         let vector_length = calculate_vector_length(edge);
//         edges_info.set(edge.data().source + edge.data().target, [edge.data().weight, vector_length]);
//     })
// })
//
// function calculate_vector_length(edge) {
//     let node_a = nodes_positions.get(edge.data().source);
//     let node_b = nodes_positions.get(edge.data().target);
//
//     return Math.sqrt(Math.pow(node_b[0] - node_a[0], 2) + Math.pow(node_b[1] - node_a[1], 2));
// }
//
$(function () {

    $('#tab3').addClass('open-section');
    $('#tab2, #tab1, #tab4, #tab5').addClass('hide-section');

    $('#algorithm').click(function () {
        $('#tab1').removeClass('hide-section').addClass('open-section');
        $('#tab2, #tab3, #tab4, #tab5').removeClass('open-section').addClass('hide-section');
    })

    $('#representation').click(function () {
        $('#tab2').removeClass('hide-section').addClass('open-section');
        $('#tab1, #tab3, #tab4, #tab5').removeClass('open-section').addClass('hide-section');
    })

    $('#configuration').click(function () {
        $('#tab3').removeClass('hide-section').addClass('open-section');
        $('#tab2, #tab1, #tab4, #tab5').removeClass('open-section').addClass('hide-section');
    })

    $('#tutorial').click(function () {
        $('#tab4').removeClass('hide-section').addClass('open-section');
        $('#tab2, #tab3, #tab1, #tab5').removeClass('open-section').addClass('hide-section');
    })

    $('#about').click(function () {
        $('#tab5').removeClass('hide-section').addClass('open-section');
        $('#tab2, #tab3, #tab5, #tab1').removeClass('open-section').addClass('hide-section');
    })


    $('.row li:nth-child(3)').addClass('active');
    $(".row li").click(function () {
        $('.row li').removeClass('active');
        $(this).addClass('active');
    })
})



$(function () {
    let line = $('hr');
    line.css({
        'left': $('.row li:first-child').position().left,
        'width': $('.row li:first-child').width()
    });

    $(".row li").hover(function () {
        let el = $(this);
        line.stop().animate({
            'left': el.position().left,
            'width': el.width()
        }, 300)
    }, function () {
        let active_el = $('.active');
        line.stop().animate({
            'left': active_el.position().left,
            'width': active_el.width()
        }, 300);
    });
})



