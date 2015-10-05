import {Krux, AbstractStore, ActionProvider, AuthStore, EventManager} from '../index'
import TestKrux from './fakes/TestKrux'


describe('Krux', () => {
    it('should get Store', () => {
        AbstractStore.get('TestStore').should.be.instanceOf(AbstractStore)
        TestKrux.store('TestStore').should
            .be.instanceOf(AbstractStore)
            .and.to.have.deep.property('key', 'TestStore')
    })
    it('should get Action', () => {
        ActionProvider.get('TestAction').should
            .be.instanceOf(ActionProvider)
        TestKrux.actions('TestAction').should
            .be.instanceOf(ActionProvider)
            .and.to.have.deep.property('key', 'TestAction')
    })
    it('should get SharedEventManager', () => {
        TestKrux.sharedEventManager().should.be.instanceOf(EventManager)
    })
});