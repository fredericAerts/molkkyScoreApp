describe('Controller: Players', function() {

    beforeEach(module('molkkyscore'));

    var controller, playersService;

    beforeEach(inject(function($controller, _playersService_) {
        playersService = _playersService_;
        controller = $controller('PlayersCtrl', {});
    }));

    it('should have 5 players', function() {
        expect(controller.players.length).to.equal(5);
    });

    describe('when player removed', function() {
        beforeEach(function() {
            playersService.remove(playersService.all()[0]);
        });

        it('should have 4 players', function() {
            expect(controller.players.length).to.equal(4);
        });
    });

    // describe('documentSaved property', function() {

    //     beforeEach(function() {
    //         // We don't want extra HTTP requests to be sent
    //         // and that's not what we're testing here.
    //         sinon.stub(scope, 'sendHTTP', function() {});

    //         // A call to $apply() must be performed, otherwise the
    //         // scope's watchers won't be run through.
    //         scope.$apply(function () {
    //             scope.document.text += ' And some more text';
    //         });
    //     });

    //     it('should watch for document.text changes', function() {
    //         expect(scope.state.documentSaved).to.equal(false);
    //     });

    //     describe('when calling the saveDocument function', function() {

    //         beforeEach(function() {
    //             scope.saveDocument();
    //         });

    //         it('should be set to true again', function() {
    //             expect(scope.state.documentSaved).to.equal(true);
    //         });

    //         afterEach(function() {
    //             expect(scope.sendHTTP.callCount).to.equal(1);
    //             expect(scope.sendHTTP.args[0][0]).to.equal(scope.document.text);
    //         });
    //     });
    // });
});
