from stockApp.models import Users
from stockApp.models import Stocks
from stockApp.models import Purchases
from stockApp.models import StockPile
from collections import namedtuple

def isNewUser (user_id):
    try:
        Users.objects.get(user_id=user_id)
        return False
    except:
        return True

def getUser (user_id):
    if not isNewUser(user_id):
        return Users.objects.get(user_id=user_id)
    return None
    

def updateBalance (user_id, change_value):
    user = getUser(user_id)
    if user != None:
        user.balance = float(user.balance) + float(change_value)
        user.save() 
    return

def getStock(stock_id,stock_name=None):
    try:
        stock = Stocks.objects.get(stock_id=stock_id) 
    except:
        stock = Stocks(stock_id=stock_id,name=stock_name)
        stock.save()        
    return Stocks.objects.get(stock_id=stock_id) 

def addToStokePile(user,stock, name, s_id, quantity):
    try:
        pile_instance = StockPile.objects.get(user_id=user, stock_id=stock)
    except:
        pile_instance = StockPile(stock_id=stock,user_id=user, name=name, s_id=s_id, count=0)
    pile_instance.count = int(pile_instance.count) + int(quantity)
    pile_instance.save()

def getUsersStoke(user,stock):
    try:
        stock = StockPile.objects.get(stock_id=stock, user_id=user)
        return stock 
    except:
        return None

def removeUsersStoke(user, stock):
    stock = getUsersStoke(user, stock)
    stock.delete()

def getPurchases(user):
    purchases = Purchases.objects.filter(user_id=user)
    if len(purchases)>0:
        return purchases
    return None

def getUserStocks(user):
    stocks = StockPile.objects.filter(user_id=user)
    if len(stocks)>0:
        return stocks
    return None