import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Column } from '@onecx/portal-integration-angular'
import { CreateHelp, Product } from 'src/app/shared/generated'

export interface HelpDetailForm {
  product: FormControl<Product | null>
  itemId: FormControl<string | null>
  context: FormControl<string | null>
  baseUrl: FormControl<string | null>
  resourceUrl: FormControl<string | null>
}

@Component({
  selector: 'app-help-form',
  templateUrl: './help-form.component.html'
})
export class HelpFormComponent implements OnChanges {
  @Input() helpItem: CreateHelp | undefined
  @Input() changeMode = 'NEW'
  @Input() products: Product[] = []

  public formGroup: FormGroup
  public columns: Column[] = [
    { field: 'product', header: 'PRODUCT' },
    { field: 'itemId', header: 'HELP_ITEM_ID' },
    { field: 'baseUrl', header: 'BASE_URL' },
    { field: 'context', header: 'CONTEXT' },
    { field: 'resourceUrl', header: 'RESOURCE_URL' }
  ]

  public productsFiltered: Product[] = []
  constructor() {
    this.formGroup = new FormGroup<HelpDetailForm>({
      product: new FormControl(null, [Validators.required]),
      itemId: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
      context: new FormControl(null, [Validators.maxLength(255)]),
      baseUrl: new FormControl(null, [Validators.maxLength(255)]),
      resourceUrl: new FormControl(null, [Validators.maxLength(255)])
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.helpItem)
      this.formGroup.patchValue({
        ...this.helpItem
      })
    else this.formGroup.reset()
  }

  public filterProducts(event: { query: string }) {
    const query = event.query.toLowerCase()
    this.productsFiltered = this.products?.filter((product) => product.displayName.toLowerCase().includes(query))
  }
}
