import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ButikService } from '../services/butik.service';
import { Butiks } from '../models/butik.model';
import { Subscription } from 'rxjs';
import { KategoriService } from '../services/kategori.service';


@Component({
  selector: 'app-butik',
  templateUrl: './butik.component.html',
  styleUrls: ['./butik.component.css'], // Plural
})

export class ButikComponent implements OnInit,OnDestroy {
  butikList: Butiks[] =[];
  private getButikSub : Subscription = new Subscription();
  private messageSub : Subscription = new Subscription();
  messageExecute : string="";

  mode : string = "Simpan";

  //pagination
  p: number = 1;

  constructor(
    public butikService : ButikService
    public kategoriService: KategoriService 
  ){}

  ngOnInit(): void {
    this.getButikSub = this.butikService.getButikListener()
    .subscribe((value : Butiks[])=>{
      this.butikList= value;
    });

    this.messageSub = this.butikService.exexuteButikListener()
    .subscribe((value)=>{
      this.messageExecute=value;
    });

    this.butikService.getButik();
  }

  ngOnDestroy(): void {
    this.getButikSub.unsubscribe();
    this.messageSub.unsubscribe();
  }

  tampilData(butik : Butiks, form : NgForm){
    var kat1 : boolean=false;
    var kat2 : boolean =false;
    var kat3 : boolean = false;

    butik.kategori.forEach((val)=>{
      if(val.toUpperCase().trim()==="PAKAIAN"){
        kat1 =true;
      }else if(val.toUpperCase().trim()==="SEPATU"){
        kat2= true;
      }else if(val.toUpperCase().trim()==="LAINNYA"){
        kat3 =true;
      }
    });

    form.setValue({
      id : butik._id,
      nama : butik.nama,
      harga : butik.harga,
      kategori1 : kat1,
      kategori2 : kat2,
      kategori3 : kat3
    })

    this.mode="Perbaiki"
  }

  onReset(){
    this.mode="Simpan"
    this.messageExecute=""
  }

  simpanButik(form : NgForm){

    if(form.invalid){
      //console.log("Tidak Valid");
      //alert("Data tidak valid");
      return;
    }

    let kategoris: string[] =[];

    if (form.value.kategori1==true){
      kategoris.push("Pakaian")
    }

    if(form.value.kategori2==true){
      kategoris.push("Sepatu")
    }

    if(form.value.kategori3==true){
      kategoris.push("Lainnya")
    }
    // console.log("Pengujian Klik")
    // console.log(form.value.nama);
    // console.log(form.value.harga);
    // console.log(kategoris);

    if(this.mode.toUpperCase() === "SIMPAN"){
      this.KategoriService.addButik(form.value.nama, form.value.harga,);
    }else{
      this.butikService.updateButik(form.value.nama, form.value.harga,
        kategoris, form.value.id);
    }

    form.resetForm();
    this.mode="Simpan";
  }

  hapusButik(butik : Butiks){
    if (confirm("Hapus Data butik : " + butik.nama)){
          this.butikService.deleteButik(butik);
    }

  }

}
