from django.db import models

class Users (models.Model):
    user_id = models.CharField(unique=True,max_length=30)
    name = models.CharField(max_length=25)
    earnings = models.FloatField()
    losses = models.FloatField()
    balance = models.FloatField()

    def __str__(self):
        return self.user_id


class Stocks(models.Model):
    stock_id = models.CharField(unique=True,max_length=30)
    name = models.CharField(max_length=25)

    def __str__(self):
        return self.stock_id


class StockPile(models.Model):
    stock_id = models.ForeignKey(Stocks,on_delete=models.CASCADE)
    user_id = models.ForeignKey(Users,on_delete=models.CASCADE)
    name = models.CharField(max_length=25,null=True)
    s_id = models.CharField(max_length=25,default='0000000')
    count = models.IntegerField()

class Purchases (models.Model):
    stock_id = models.ForeignKey(Stocks,on_delete=models.CASCADE)
    count = models.IntegerField()
    purchase_date = models.DateField()
    price = models.FloatField()
    user_id = models.ForeignKey(Users,on_delete=models.CASCADE)
    active =  models.BooleanField(default=True)

