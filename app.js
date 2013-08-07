

var app = angular.module('stockQuote', []);


app.service('UserStocks', function() {
  this.data = [
    { symbol: 'GME', qty: 100, price: 47.50, comm: 9.99 },
    { symbol: 'MSFT', qty: 200, price: 31.25, comm: 9.99 }
  ];


  this.add = function(symbol) {
    this.data.push({
      symbol: symbol, qty: 0, price: 0, comm: 0
    });
  };

  this.remove = function(row) {
    var index = this.data.indexOf(row);

    if (~index) {
      this.data.splice(index, 1);
    }
  };
});

app.controller('StockListController', ['$scope', 'UserStocks', function($scope, UserStocks) {
  $scope.data = UserStocks.data;

  $scope.valueOf = function(row) {
    return row.qty * row.price;
  };

  $scope.remove = function(row) {
    UserStocks.remove(row);
  };
}]);


app.controller('AddSymbolFormController', ['$scope', 'UserStocks', function($scope, UserStocks) {
  $scope.stock = { symbol: '' };

  $scope.addStock = function() {
    UserStocks.add($scope.stock.symbol);

    $scope.stock.symbol = '';
  };
}]);

