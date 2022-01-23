$(function () {
    
    let color1 = $('#color1');
    let color2 = $('#color2');
    let color4 = $('#color4');
    let clear_button = $('#clear');
    let clear_all_edges = $('#clear-edge')

    $('.colorPick').change(function () {
        console.log('linear-gradient(' + color1.val() + ',' + color2.val() + ') no-repeat fixed');
        $("body").css({
            background : 'linear-gradient(' + color1.val() + ',' + color2.val() + ') no-repeat fixed'
        }, 200)
        console.log($(this).val());
    });

    let node_color = $('#color3');

    node_color.change(function () {
        cy.nodes().style('background-color', $(this).val());
    });

    color4.change(function () {
        console.log('zmena');
        cy.edges().style({
            'line-color': $(this).val(),
            'target-arrow-color' : $(this).val()
        });
    })


    clear_button.click(function () {
        cy.elements().remove();
    });

    clear_all_edges.click(function () {
        cy.edges().remove();
        edges_info.clear();
        console.log(edges_info);
    })

    
})