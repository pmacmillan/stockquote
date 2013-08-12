

var app = angular.module('stockQuote', []);


app.service('Quote', ['$http', function($http) {
  this.currentPriceOf = function(symbol, cb) {
    var q = $http.jsonp('http://finance.google.com/finance/info?client=ig&callback=JSON_CALLBACK&q=' + symbol);

    q.success(function(data, status, headers, config) {
      cb(null, data[0].l);
    });

    q.error(function(data, status, headers, config) {
      cb('request failed. bad symbol or service not available');
    });

  };
}]);


app.service('UserStocks', function(Quote) {
  this.data = [
    { symbol: 'NYSE:GME', qty: 100, price: 47.50, comm: 9.99 },
    { symbol: 'MSFT', qty: 200, price: 31.25, comm: 9.99 }
  ];


  this.add = function(symbol) {
    var data = this.data;

    Quote.currentPriceOf(symbol, function(err, price) {
      if (err) {
        alert(err);
        return;
      }

      data.push({
        symbol: symbol, qty: 0, price: 0, comm: 0, current: price
      });
    });
  };

  this.remove = function(row) {
    var index = this.data.indexOf(row);

    if (~index) {
      this.data.splice(index, 1);
    }
  };
});

app.controller('StockListController', ['$scope', 'UserStocks', 'Quote', function($scope, UserStocks, Quote) {
  $scope.data = UserStocks.data;

  $scope.valueOf = function(row) {
    return row.qty * row.price + (+row.comm);
  };

  $scope.marketValueOf = function(row) {
    if (!row.current) return 0;

    return row.qty * row.current;
  };

  $scope.remove = function(row) {
    UserStocks.remove(row);
  };

  $scope.bookValue = function() {
    return UserStocks.data.reduce(function(total, row) {
      total += row.qty * row.price + (+row.comm);
      return total;
    }, 0);
  };

  $scope.marketValue = function() {
    return UserStocks.data.reduce(function(total, row) {
      if (!row.current) return total;

      total += row.qty * row.current;
      return total;
    }, 0);
  };

  $scope.update = function(row) {
    Quote.currentPriceOf(row.symbol, function(err, price) {
      if (err) {
        alert(err);
        return;
      }

      row.current = price;
    });
  };
}]);


app.controller('AddSymbolFormController', ['$scope', 'UserStocks', function($scope, UserStocks) {
  $scope.stock = { symbol: '' };

  $scope.addStock = function() {
    UserStocks.add($scope.stock.symbol);

    $scope.stock.symbol = '';
  };
}]);



app.directive('toggleEdit', function() {
  return {
    restrict: 'A',
    template: '<div class="editable-input"><a href="" class="editable-input-label">{{ label }}</a><span class="input"><input type="text" ng-model="value"></span></div>',
    replace: true,
    scope: {
      toggleEdit: '&',
      value: '=ngModel'
    },
    link: function(scope, el, attrs) {
      var $label = el.find('.editable-input-label');
      var $input = el.find(':input').hide();

      $label.on('focus click', function(ev) {
        $label.toggle(false);
        $input.toggle(true);

        $input.focus();
      });

      $input.on('keyup blur', function(e) {
        if (e.type == 'blur' || e.which == 13 || e.which == 10 || e.which == 27) {
          $label.toggle(true);
          $input.toggle(false);

          if (e.type != 'blur') {
            $input.blur();
          }
        }
      });

      scope.$watch('value', function(v) {
        scope.label = scope.toggleEdit({ value: scope.value });
      })
    }
  };
});








