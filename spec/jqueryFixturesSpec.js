describe('jquery fixtures', function() {
  jasmine.getFixtures().fixturesPath = '/base';

  beforeEach(function() {

    this.userController = jasmine.createSpyObj('userController',
      [ 'getUserTemplate', 'find', 'save', 'delete', 'add' ]);

    this.userController.getUserTemplate.and.returnValue(
      Promise.resolve(readFixtures('userTemplate.html'))
    );

    UserModel = this.userModel = jasmine.createSpy('userModel');
    this.userModel.and.callFake(function(userObj) {
      return userObj;
    });

    this.user = {
      id: 50,
      name: 'mark',
      email: 'mark@zzo.com',
      favoriteColor: 'green'
    };

    setFixtures('<div id="users"></div>');
    this.userView = new UserView(this.userController);
  });

  it('sets up events', function() {
    expect($("#users")).toHandle('click');
    expect($("#users")).toHandle('keypress');
  });

  it('fills out template', function(done) {
    this.userView.fillTemplate({ 
      id: 50,
      name: 'mark',
      email: 'mark@zzo.com',
      favoriteColor: 'green'
    }).then(function(template) {
      expect(template).toContainText(50);
      expect(template).toContainText('mark');
      expect(template).toContainText('mark@zzo.com');
      expect(template).toContainText('green');
      done();
    });
  });

  it('appends template to DOM', function(done) {
    this.userView.appendUser({ 
      id: 50,
      name: 'mark',
      email: 'mark@zzo.com',
      favoriteColor: 'green'
    }).then(function(template) {
      expect($("#user_50")).toBeInDOM();
      expect($("#user_50")).toBeVisible();
      done();
    }).catch(done.fail);
  });

  it('click turn to text field', function(done) {
    this.userView.appendUser({ 
      id: 50,
      name: 'mark',
      email: 'mark@zzo.com',
      favoriteColor: 'green'
    }).then(function(template) {
      $('.user-name').trigger('click');
      expect($('input')).toBeMatchedBy('input.inplace');
      expect($('input.inplace')).toBeFocused();
      done();
    }).catch(done.fail);
  });

  it('keypress replaces input text box', function(done) {
    this.userController.save.and.callFake(function(user) {
      expect(user.name).toEqual('bobby');
      return Promise.resolve(user);
    });

    this.userView.appendUser(this.user)
      .then(function(template) {
        $('.user-name').trigger('click');
        $('input').val('bobby');
        $('input').trigger({ 
          type: 'keypress',
          which: 13
        });
        // no more text input
        expect($("#users")).not.toContain('input');
        done();
      }).catch(done.fail);
  });

});
