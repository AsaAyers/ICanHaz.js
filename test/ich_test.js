function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}

module("ICanHaz");

test("creates function for template", function() {
  expect(1);
  ok(ich.test1, "test1 template exists");
});

test("creates dot namespaced templates", function(){
  expect(2);
  ok(ich.namespace.templateA, "test1 template exists");
  ok(ich.namespace.templateB, "test1 template exists");
})

test("renders non-parameterized templates", function() {
  expect(1);
  equal(ich.test1({}, true), "<p>This is a test of the emergency broadcast system.</p>"); // raw text
});

test("renders parameterized templates", function() {
  expect(1);
  equal(ich.test2({prey:'wabbits'}, true), "<span>Be vewwy vewwy quiet, we're hunting wabbits.</span>"); 
});

test("renders ad hoc templates", function() {
  ich.addTemplate('favoriteColor', 'Red. No, Blue. Aieee!');
  expect(1);
  equal(ich.favoriteColor({}, true), 'Red. No, Blue. Aieee!');
});

// Newly added support for partials
test("renders partials", function() {
  // partials example from the Mustache README
  expect(1);
  var view = {
      name: "Joe",
      winnings: {
        value: 1000,
        taxed_value: function() {
          return this.value - (this.value * 0.4);
        }
      }
  };
  equal(ich.welcome(view, true), "<p>Welcome, Joe! You just won $1000 (which is $600 after tax)</p>");
});

test("renders partials added at runtime", function() {
  // partials example from the Mustache README
  ich.addTemplate('winnings2', "You just won ${{value}} (which is ${{taxed_value}} after tax)");
  ich.addTemplate('welcome2', "Welcome, {{name}}! {{>winnings2}}");
  expect(1);
  var view = {
      name: "Joe",
      winnings2: {
        value: 1000,
        taxed_value: function() {
          return this.value - (this.value * 0.4);
        }
      }
  };
  equal(ich.welcome2(view, true), 'Welcome, Joe! You just won $1000 (which is $600 after tax)');
});

test("clearAll should wipe 'em out", function () {
    ich.clearAll();
    
    ok(isEmptyObject(ich.templates));
    ok(isEmptyObject(ich.partials));
    
    equal(ich.welcome2, undefined, "welcome2 template gone?");
});

test("grabTemplates that are loaded in later", function () {
    // not recommended use, but should work nonetheless
    var el = document.createElement('script');
    el.id = "flint";
    el.type = "text/html";
    el.text = "yabba {{ something }} doo!";
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(el);
    
    ich.grabTemplates();
    equal(ich.flint({something: 'dabba'}, true), "yabba dabba doo!", "should have new template");
});

test("refresh should empty then grab new", function () {
    // not recommended use, but should work nonetheless
    var el = document.createElement('script');
    el.id = "mother";
    el.type = "text/html";
    el.text = "your mother was a {{ something }}...";
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(el);
    
    ich.refresh();
    
    equal(ich.mother({something: 'hampster'}, true), "your mother was a hampster...", "should have new template");
    equal(ich.hasOwnProperty('flint'), false, "flint template should be gone");
});

test("can add multiple templates at once", function () {
    var templates = {
            first: "first {{person}}",
            second: "second {{person}}"
        },
        obj = {
            person: "bob"
        };
    ich.addTemplate(templates);
    equal(ich.first(obj, true), 'first bob');
    ok(ich.second(obj, true), 'second bob');
});
