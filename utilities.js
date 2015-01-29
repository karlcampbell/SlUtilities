'use strict';

var utilities = angular.module('SlUtilities', []);

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
        //console.log(attr.usSpinner);
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


utilities.factory('utilities', function (spinner, toast, $state) {

    return {
      spin: function(start) {
        if(start) {
          spinner.start();
        } else {
          spinner.stop();
        }
      },

      redirect: function(message, state, error) {
        spinner.stop();
        if(!error) {
          toast.success(message);
        } else {
          toast.error(message);
        }
        $state.go(state.state, state.params);
      },

      message: function(message, type) {
        if(!type || type === 'success') {
          toast.success(message);
        }
        if(type === 'error') {
          toast.error(message);
        }
      }


    };
  });