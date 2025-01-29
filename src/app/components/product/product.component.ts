import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiServiceService } from '../../services/api-service.service';
import { Product } from '../../models';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  dataSource: MatTableDataSource<Product>=new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'price', 'category', 'manufacture_date', 'stock_status', 'discount_available', 'actions'];
  productForm: FormGroup;
  categories: string[] = ['Electronics', 'Furniture', 'Clothing'];
  isEditMode = false;
  currentProductId: number | null = null;
  selectedFile: File | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('productFormTemplate') productFormTemplate!: TemplateRef<any>;
  @ViewChild('deleteConfirmationTemplate') deleteConfirmationTemplate!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private dialog: MatDialog
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      manufacture_date: [''],
      stock_status: ['', Validators.required],
      discount_available: [false],
      description: ['', Validators.maxLength(200)]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe(products => {
      this.products = products;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddProductForm(): void {
    this.isEditMode = false;
    this.productForm.reset();
    this.dialog.open(this.productFormTemplate);
  }

  openEditProductForm(product: Product): void {
    this.isEditMode = true;
    this.currentProductId = product.id;
    this.productForm.patchValue(product);
    this.dialog.open(this.productFormTemplate);
  }

  openDeleteConfirmation(id: number): void {
    const dialogRef = this.dialog.open(this.deleteConfirmationTemplate, {
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(id);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEditMode && this.currentProductId !== null) {
        this.apiService.updateProduct(this.currentProductId, productData).subscribe(() => {
          this.loadProducts();
          this.dialog.closeAll();
        });
      } else {
        this.apiService.createProduct(productData).subscribe(() => {
          this.loadProducts();
          this.dialog.closeAll();
        });
      }
    }
  }

  deleteProduct(id: number): void {
    this.apiService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
}