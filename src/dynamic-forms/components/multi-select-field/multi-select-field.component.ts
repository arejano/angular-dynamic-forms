import { CommonModule } from "@angular/common";
import {
  Component,
  Inject,
  Optional,
  ElementRef,
  ViewChild,
  HostListener,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, FormsModule } from "@angular/forms";

interface MultiSelectOption {
  hash: string;
  descricao: string;
}

@Component({
  selector: "app-multi-select-field",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: "./multi-select-field.component.html",
  styleUrl: "./multi-select-field.component.scss",
})
export class MultiSelectFieldComponent {
  @ViewChild("container", { static: true }) container!: ElementRef;
  @ViewChild("dropdown", { static: false }) dropdown!: ElementRef;
  @ViewChild("searchInput", { static: false }) searchInput!: ElementRef;

  public fieldId: string;
  public isDropdownOpen: boolean = false;
  public selectedItems: MultiSelectOption[] = [];
  public displayText: string = "";
  public maxVisibleItems: number = 3;
  public hiddenCount: number = 0;
  public searchTerm: string = "";
  public filteredOptions: MultiSelectOption[] = [];
  public hoveredIndex: number = -1;
  public isAllSelected: boolean = false;

  constructor(
    @Inject(FormControl) public control: FormControl,
    @Optional() @Inject("options") public options?: MultiSelectOption[],
    @Optional() @Inject("name") public fieldName?: string,
    @Optional() @Inject("placeholder") public placeholder?: string,
  ) {
    if (!this.options) {
      this.options = [];
    }

    this.fieldId = this.fieldName!;
    this.placeholder = this.placeholder || "Selecione opções";

    // Observar mudanças no FormControl para sincronizar
    this.control.valueChanges.subscribe((value) => {
      this.syncSelectedItems(value);
    });

    // Inicializar com valores existentes
    this.syncSelectedItems(this.control.value);
    this.updateFilteredOptions();

    // Escutar mudanças diretas no control para sincronizar
    this.control.valueChanges.subscribe((value) => {
      if (
        JSON.stringify(value) !==
        JSON.stringify(this.selectedItems.map((item) => item.hash))
      ) {
        this.syncSelectedItems(value);
      }
    });
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    if (!this.container.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): void {
    // Se o dropdown não estiver aberto
    if (!this.isDropdownOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        this.openDropdown();
        return;
      }
      return;
    }

    // Se o dropdown estiver aberto, interceptar navegação
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();
        this.navigateDown();
        break;
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        this.navigateUp();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        event.stopPropagation();
        if (this.hoveredIndex >= 0 && this.filteredOptions[this.hoveredIndex]) {
          this.toggleOption(this.filteredOptions[this.hoveredIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        this.closeDropdown();
        this.container.nativeElement.focus();
        break;
      case "Tab":
        this.closeDropdown();
        break;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.hoveredIndex = 0; // Começar no primeiro item
      this.updateFilteredOptions();
      setTimeout(() => {
        // Manter foco no container para navegação por teclado
        this.container.nativeElement.focus();
      }, 0);
    } else {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.searchTerm = "";
    this.updateFilteredOptions();
    this.resetHover();
  }

  openDropdown(): void {
    this.isDropdownOpen = true;
    this.hoveredIndex = 0; // Começar no primeiro item
    this.updateFilteredOptions();
    setTimeout(() => {
      this.container.nativeElement.focus();
    }, 0);
  }

  onOptionClick(option: MultiSelectOption, event: Event): void {
    event.stopPropagation();
    this.toggleOption(option);
  }

  toggleOption(option: MultiSelectOption): void {
    const isSelected = this.isOptionSelected(option);

    if (isSelected) {
      this.removeOption(option);
    } else {
      this.addOption(option);
    }
  }

  addOption(option: MultiSelectOption): void {
    if (!this.isOptionSelected(option)) {
      this.selectedItems.push(option);
      this.updateFormControl();
      this.updateDisplayText();
    }
  }

  removeOption(option: MultiSelectOption): void {
    this.selectedItems = this.selectedItems.filter(
      (item) => item.hash !== option.hash,
    );
    this.updateFormControl();
    this.updateDisplayText();
  }

  removeOptionByIndex(index: number, event: Event): void {
    event.stopPropagation();
    this.selectedItems.splice(index, 1);
    this.updateFormControl();
    this.updateDisplayText();
  }

  isOptionSelected(option: MultiSelectOption): boolean {
    return this.selectedItems.some((item) => item.hash === option.hash);
  }

  private updateFormControl(): void {
    const values = this.selectedItems.map((item) => item.hash);
    this.control.setValue(values, { emitEvent: true });
    this.control.markAsDirty();
    this.control.markAsTouched();
  }

  private syncSelectedItems(controlValue: string[] | null): void {
    if (!controlValue || !Array.isArray(controlValue)) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [];
      controlValue.forEach((hash) => {
        const option = this.options?.find((opt) => opt.hash === hash);
        if (option) {
          this.selectedItems.push(option);
        }
      });
    }
    this.updateDisplayText();
    this.updateAllSelectedState();
    this.updateFilteredOptions();
  }

  private updateFilteredOptions(): void {
    if (!this.options) {
      this.filteredOptions = [];
      return;
    }

    if (!this.searchTerm) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter((option) =>
        option.descricao.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }
    this.resetHover();
  }

  private updateAllSelectedState(): void {
    this.isAllSelected =
      this.options?.length > 0 &&
      this.selectedItems.length === this.options.length;
  }

  onSearchChange(): void {
    this.updateFilteredOptions();
    this.hoveredIndex = this.filteredOptions.length > 0 ? 0 : -1;
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    // Permitir navegação mesmo quando focado no input de pesquisa
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === "Escape"
    ) {
      event.preventDefault();
      this.container.nativeElement.focus();
      this.onKeyDown(event);
    }
  }

  onSearchFocus(): void {
    // Quando o input de pesquisa recebe foco, resetar hover
    this.resetHover();
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.updateFilteredOptions();
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.clearAll(new Event("click"));
    } else {
      this.selectAll();
    }
  }

  selectAll(): void {
    if (!this.options) return;

    this.selectedItems = [...this.options];
    this.updateFormControl();
    this.updateDisplayText();
    this.updateAllSelectedState();
  }

  navigateDown(): void {
    if (this.filteredOptions.length === 0) return;
    if (this.hoveredIndex < this.filteredOptions.length - 1) {
      this.hoveredIndex++;
    } else {
      this.hoveredIndex = 0; // Circular navigation
    }
    this.scrollToHoveredItem();
  }

  navigateUp(): void {
    if (this.filteredOptions.length === 0) return;
    if (this.hoveredIndex > 0) {
      this.hoveredIndex--;
    } else {
      this.hoveredIndex = this.filteredOptions.length - 1; // Circular navigation
    }
    this.scrollToHoveredItem();
  }

  private resetHover(): void {
    this.hoveredIndex = -1;
  }

  private scrollToHoveredItem(): void {
    setTimeout(() => {
      const hoveredElement = this.dropdown?.nativeElement?.querySelector(
        `.option-item:nth-child(${this.hoveredIndex + 1})`,
      );
      if (hoveredElement) {
        hoveredElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 0);
  }

  onOptionHover(index: number): void {
    // Só atualizar hover se não estiver navegando por teclado
    if (document.activeElement === this.container.nativeElement) {
      return;
    }
    this.hoveredIndex = index;
  }

  removeSelectedItem(item: MultiSelectOption, event: Event): void {
    event.stopPropagation();
    this.removeOption(item);
  }

  isOptionHovered(index: number): boolean {
    return this.hoveredIndex === index;
  }

  private updateDisplayText(): void {
    if (this.selectedItems.length === 0) {
      this.displayText = this.placeholder || "";
      this.hiddenCount = 0;
      return;
    }

    if (this.selectedItems.length <= this.maxVisibleItems) {
      this.displayText = this.selectedItems
        .map((item) => item.descricao)
        .join(", ");
      this.hiddenCount = 0;
    } else {
      const visibleItems = this.selectedItems.slice(0, this.maxVisibleItems);
      this.displayText = visibleItems.map((item) => item.descricao).join(", ");
      this.hiddenCount = this.selectedItems.length - this.maxVisibleItems;
    }
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    this.selectedItems = [];
    this.updateFormControl();
    this.updateDisplayText();
  }

  getSelectedCount(): number {
    return this.selectedItems.length;
  }

  hasSelection(): boolean {
    return this.selectedItems.length > 0;
  }

  getPlaceholderText(): string {
    if (this.selectedItems.length === 0) {
      return this.placeholder || "Selecione opções";
    }
    return "";
  }

  trackByHash(index: number, option: MultiSelectOption): string {
    return option.hash;
  }

  trackBySelectedHash(index: number, option: MultiSelectOption): string {
    return option.hash;
  }
}
