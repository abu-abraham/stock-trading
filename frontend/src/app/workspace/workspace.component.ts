import { Component, OnInit } from '@angular/core';
import { iWorkspaceRow } from './workspace.interfaces';
import { RequestsService } from '../requests.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})


export class WorkspaceComponent implements OnInit {

  private worker: Worker;
  public rows = [];// iWorkspaceRow = <iWorkspaceRow>[];
  public balance = 0.0;
  public search_results = [];
  public selected_row: iWorkspaceRow[] = [];
  public quantity = "1";
  private ngrok_url = "https://cors.io/?https://7ace55d4.ngrok.io/";
  public name: string = "Test";
  public values;
  public dataLoaded = false;
  private user_id: string;
  public asset_amount: number = 0;



  constructor(private router: Router, private request: RequestsService) {
    if (sessionStorage.getItem("user_id") === null) {
      this.router.navigate(['login']);
    }
    this.user_id = sessionStorage.getItem("user_id");
    this.name = sessionStorage.getItem("user_name");
  }

  ngOnInit() {
    this.initialize();
    this.initWorker();
    this.displayActiveShares();
  }

  private initialize(): void {
    let url = this.ngrok_url + "login/{\"user_id\":\"" + this.user_id + "\",\"name\":\"" + this.name + "\"}";
    this.request.request(url).then((response: any) => {
      this.balance = response.balance.toFixed(2);
    }).catch(() => {
      console.log("failed to get balance");
    });
  }

  private initWorker(): void {
    this.worker = new Worker('src/app/workspace/worker.js');
    this.worker.addEventListener('message', (e: MessageEvent) => {
      this.asset_amount = this.balance;
      for (let i = 0; i < this.rows.length; i++) {
        this.rows[i].price = parseFloat(e.data[i]["Global Quote"]["05. price"])
        this.asset_amount += (this.rows[i].price * this.rows[i].count);
        this.dataLoaded = true;
      }
    });
    setInterval(() => {
      this.dataLoaded = false;
      this.worker.postMessage(this.rows);
    }, 30000);
  }

  private displayActiveShares(): void {
    let active_shares_url = this.ngrok_url + "active/%7B%22user_id%22:%22" + this.user_id + "%22%7D/";
    this.request.request(active_shares_url).then((response: any[]) => {
      this.rows = [];
      response.forEach(element => {
        this.rows.push(<iWorkspaceRow>{
          name: element.name,
          id: element.s_id,
          price: null,
          count: element.count
        });
      });
      this.worker.postMessage(this.rows);
    }).catch((error) => {
      console.log("failed to get active shares");
    });
  }

  private inValidAmount(amount: string): boolean {
    if (/^\d+$/.test(amount)) {
      if (parseInt(amount) > 0) {
        return false;
      }
    }
    return true;
  }

  public addFunds(amount = null): void {
    if (amount == null) {
      amount = (<HTMLInputElement>document.getElementById("amount")).value;
    }
    if (this.inValidAmount(amount)) {
      alert("invalid amount");
      return;
    }
    let url = this.ngrok_url + "updateBalance/{\"user_id\":\"" + this.user_id + "\",\"amount\":\"" + amount + "\"}";
    this.request.request(url).then((response: any) => {
      this.balance = response.balance.toFixed(2);
    }).catch(() => {
      console.log("failed to update");
    });
  }


  private searchValue(symbol: string, name: string): void {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=WUMS5TWMV6320E0L";
    this.request.request(url).then((response) => {
      this.selected_row = [({ "id": symbol, "name": name, "price": parseFloat(response["Global Quote"]["05. price"]) })];
    }).catch(() => {
      console.log("Error while fetching data");
    })
  }

  public search(search_key: string): void {
    this.search_results = [];
    let symbol = search_key;
    let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + symbol + "&apikey=WUMS5TWMV6320E0L";
    this.request.request(url).then((response: any) => {
      response.bestMatches.forEach(element => {
        this.search_results.push({ "symbol": element["1. symbol"], "name": element["2. name"] });
      });
    }).catch(() => {
      console.log("Failed in requesting stock prices");
    })
  }

  public selected_share(selected): void {
    this.searchValue(selected.symbol, selected.name);
  }


  public buy(data: iWorkspaceRow): void {
    if (this.inValidAmount(this.quantity)) {
      alert("Invalid number of stocks");
      return;
    }
    let temp_bal = this.balance - (parseInt(this.quantity) * parseFloat(<string>data.price));
    if (temp_bal < 0) {
      alert("Insufficent balance");
      return;
    }
    this.balance = temp_bal;
    let url = this.ngrok_url + "buyShare/{\"user_id\":\"" + this.user_id + "\",\"stock_id\":\"" + data.id + "\",\"stock_name\":\"" + data.name + "\",\"quantity\":\"" + this.quantity + "\",\"price\":\"" + data.price + "\"%7D/";
    this.request.request(url).then((response) => {
      this.selected_row = []
      this.displayActiveShares();
    }).catch(() => {
      this.balance = this.balance + temp_bal;
      console.log("Error while buying");
    })
  }

  public cancel(): void {
    this.selected_row = [];
  }

  public sell(data: iWorkspaceRow): void {
    this.quantity = "1";
    if (data.price == undefined) {
      alert("Unable to fetch value");
      return;
    }
    let url = this.ngrok_url + "sellShare/{\"user_id\":\"" + this.user_id + "\",\"stock_id\":\"" + data.id + "\",\"stock_name\":\"" + data.name + "\",\"quantity\":\"" + this.quantity + "\",\"price\":\"" + data.price + "\"%7D/";
    this.request.request(url).then((response) => {
      this.rows = [];
      this.displayActiveShares();
      this.addFunds("0");
    }).catch(() => {
      console.log("Error while selling");
    })
  }

}
