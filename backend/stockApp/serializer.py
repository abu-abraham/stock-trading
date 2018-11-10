from stockApp.models import Users, Purchases, StockPile
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Users
        fields = ('user_id','name','balance','losses','earnings')

class PurchaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Purchases
        fields = ('stock_id','count','purchase_date','price','active')


class StockPileSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockPile
        fields = ('stock_id','count','user_id','name','s_id')
