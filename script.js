$(function () {
    
    let color1 = $('#color1');
    let color2 = $('#color2');
    let color4 = $('#color4');

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

    
})