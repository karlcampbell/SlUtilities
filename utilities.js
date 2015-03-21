'use strict';

var utilities = angular.module('sl.utilities', ['ui.router']);

utilities.directive('spinner', function ($window, spinner) {
  return {
    scope: true,
    link: function (scope, element, attr) {

      var window = angular.element($window);
      scope.spinner = null;

      function stopSpinner() {
        if (scope.spinner) {
          scope.spinner.stop();
          scope.spinner = null;
          element.hide();
        }
      }

      function startSpinner() {
        element.show();
        scope.spinner = new $window.Spinner(angular.fromJson(attr.spinner.replace(/'/g, '\"')));
        scope.spinner.spin(element[0]);
      }

      scope.$watch(spinner.spinning, function (start) {

        if (start) {
          startSpinner()
        } else {
          stopSpinner();
        }
      });

      scope.$on('$destroy', function () {
        stopSpinner();
      });

      scope.style = function () {
        var top = window.height() / 2 - 35;
        var left = window.width() / 2 - 35;
        return {
          'top': top + 'px',
          'left': left + 'px'
        };
      }
    }
  };
});

//factory


utilities
  .factory('spinner', function () {

    var spin = false;

    // Public API here
    return {
      start: function () {
        spin = true;
      },
      stop: function () {
        spin = false;
      },
      spinning: function () {
        return spin;
      }
    };
  })
  .factory('toast', function () {
    return {
      success: function (message) {
        toastr.success(message)
      },
      error: function (message) {
        toastr.error(message);
      }
    };
  })
  .factory('sl', function (spinner, toast, $state) {

    return {
      spin: function (start) {
        if (start === true) {

          spinner.start();
        } else {
          spinner.stop();
        }
      },

      redirect: function (message, state, error) {
        spinner.stop();
        if (!error) {
          toast.success(message);
        } else {
          toast.error(message);
        }
        $state.go(state.state, state.params);
      },

      message: function (message, type) {
        if (!type || type === 'success') {
          toast.success(message);
        }
        if (type === 'error') {
          toast.error(message);
        }
      },

      errors: function (message, errors) {
        spinner.stop();
        message += '<ul>';
        angular.forEach(errors, function (e) {
          message += '<li>' + e + '</li>';
        });
        message += '</ul>';
        toast.error(message);
      }


    };
  });