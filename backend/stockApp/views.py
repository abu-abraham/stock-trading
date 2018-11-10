from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from stockApp.models import Users
from stockApp.models import Stocks
from stockApp.models import Purchases
from stockApp.models import StockPile
from collections import namedtuple
import json
import datetime
from stockApp.serializer import UserSerializer, PurchaseSerializer, StockPileSerializer
from stockApp.util import *
from django.views.decorators.csrf import csrf_exempt

#An example of using post
@csrf_exempt
def getPostTrial(request):
    print(request.POST['abc'])
    return JsonResponse({'result':'success'},status=200)

def updateUserInfo(self,JSobject):
    user_details = json.loads(JSobject, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
    if isNewUser(user_details.user_id):
        user = Users(user_id=user_details.user_id,name=user_details.name,earnings=0.0,losses=0.0,balance=0.0)
        user.save()    
    user = UserSerializer(getUser(user_details.user_id),many=False)  
    return JsonResponse(user.data,safe=False)

#[user_id, stock_id, stock_name, quantity, price]
def purchaseShare(self, JSobject):
    stock_info = json.loads(JSobject, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
    user = getUser(stock_info.user_id)
    if user.balance - float(int(stock_info.quantity)*float(stock_info.price))<0:
        return JsonResponse({'result':'failure, no funds'},status=500)
    stock = getStock(stock_info.stock_id,stock_info.stock_name)
    details = Purchases(stock_id=stock, count=stock_info.quantity,price=stock_info.price, user_id=user,purchase_date=datetime.datetime.now())
    details.save()
    addToStokePile(user, stock, stock_info.stock_name, stock_info.stock_id, stock_info.quantity)
    updateBalance(user.user_id, -1*float(int(stock_info.quantity)*float(stock_info.price)))
    return JsonResponse({'result':'success'})

#[user_id, stock_id, quantity,price]
def sellShare(self, JSobject):
    sell_details = json.loads(JSobject, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
    user = getUser(sell_details.user_id)
    stock = getStock(sell_details.stock_id)
    stock_instance = getUsersStoke(user,stock)
    if user == None or stock_instance == None:
        return JsonResponse({'result':'failure'},status=500)

    if int(stock_instance.count) - int(sell_details.quantity) >= 0:
        stock_instance.count = int(stock_instance.count) - int(sell_details.quantity)
        stock_instance.save()
        if stock_instance.count <= 0:
            removeUsersStoke(user,stock)
    else:
        return JsonResponse({'result':'you dont have enough stocks'},status=500)
    updateBalance(user.user_id, float(int(sell_details.quantity)*float(sell_details.price)))
    return JsonResponse({'result':'succes'})

def updateUserBalance(self, JSobject):
    update_details = json.loads(JSobject, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
    updateBalance(update_details.user_id,update_details.amount)
    user = UserSerializer(getUser(update_details.user_id),many=False)  
    return  JsonResponse(user.data,safe=False)

def getHistory(self, JSobject):
    request_details = json.loads(JSobject, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
    user = getUser(request_details.user_id)
    if user != None:
        purchases = getPurchases(user)
        if purchases !=None:
            history = PurchaseSerializer(purchases,many=True)
            return JsonResponse(history.data,safe=False)
    return JsonResponse({'result':'failure'},status=500)

def getCurrentStocks(self, JSobject):
    request_details = json.loads(JSobject, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
    user = getUser(request_details.user_id)
    if user != None:
        purchases = getUserStocks(user)
        if purchases != None:
            stocks = StockPileSerializer(purchases,many=True)
            return JsonResponse(stocks.data,safe=False)
    return JsonResponse({'result': []})

    