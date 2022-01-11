cy.on('tap', function(event){
    let evtTarget = event.target;

    if( evtTarget === this ){
        let xPos = event.position.x;
        let yPos = event.position.y;
        let newId = 'new' + Math.round( Math.random() * 100 );
        console.log(xPos, yPos);
        let node = this.add([{
            group: "nodes",
            data: { id: newId, label: 'new' + Math.round( Math.random() * 100 )},
            position: {
                x: xPos,
                y: yPos,
            },
        }]);

        node.style('background-color', $('#color3').val());
        nodes_positions.set(newId, [xPos, yPos]);
    }
});
