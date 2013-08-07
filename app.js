

var app = angular.module('stockQuote', []);

app.service('UserStocks', function() {
  return {
    data: [],

    addSymbol: function(symbol) {
      this.data.push({
        symbol: symbol, qty: 0, price: 0, comm: 0
      });
    }
  };
});

app.controller('StockListController', ['$scope', 'UserStocks', function($scope, UserStocks) {
  $scope.data = UserStocks.data;
}]);


app.controller('AddSymbolFormController', ['$scope', 'UserStocks', function($scope, UserStocks) {
  $scope.stock = { symbol: '' };

  $scope.addStock = function() {
    UserStocks.addSymbol($scope.stock.symbol);

    $scope.stock.symbol = '';
  };
}]);

