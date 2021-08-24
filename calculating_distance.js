cy.on('drag', "node", function() {
    let l = this.incomers('node').filter(h => h.id() !== this.id()).map(node => node.id());
    console.log(l);
});