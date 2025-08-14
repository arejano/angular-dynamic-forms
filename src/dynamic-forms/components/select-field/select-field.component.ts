import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  Inject,
  Optional
} from "@angular/core";
import { FormControl, ReactiveFormsModule, FormsModule } from "@angular/forms";

interface SelectOption {
  hash: string;
  descricao: string;
}

@Component({
  selector: "app-select-field",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./select-field.component.html",
  styleUrl: "./select-field.component.scss",
})
export class SelectFieldComponent {
  @ViewChild("container", { static: true }) container!: ElementRef;
  @ViewChild("dropdown", { static: false }) dropdown!: ElementRef;
  @ViewChild("searchInput", { static: false }) searchInput!: ElementRef;

  public fieldId: string;
  public isDropdownOpen = false;
  public selectedItem: SelectOption | null = null;
  public searchTerm = "";
  public filteredOptions: SelectOption[] = [];
  public hoveredIndex = -1;

  constructor(
    @Inject(FormControl) public control: FormControl,
    @Optional() @Inject("options") public options?: SelectOption[],
    @Optional() @Inject("name") public fieldName?: string,
    @Optional() @Inject("placeholder") public placeholder?: string
  ) {
    this.options = this.options || [];
    this.fieldId = this.fieldName || "select-field";
    this.placeholder = this.placeholder || "Selecione uma opção";

    this.control.valueChanges.subscribe((value) => {
      const found = this.options?.find(opt => opt.hash === value) || null;
      this.selectedItem = found;
    });

    this.updateFilteredOptions();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    if (!this.container.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.updateFilteredOptions();
      this.hoveredIndex = 0;
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.searchTerm = "";
    this.hoveredIndex = -1;
  }

  onOptionClick(option: SelectOption, event: Event): void {
    event.stopPropagation();
    this.selectedItem = option;
    this.control.setValue(option.hash);
    this.closeDropdown();
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selectedItem = null;
    this.control.setValue(null);
  }

  updateFilteredOptions(): void {
    if (!this.searchTerm) {
      this.filteredOptions = [...this.options!];
    } else {
      this.filteredOptions = this.options!.filter(opt =>
        opt.descricao.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearchChange(): void {
    this.updateFilteredOptions();
    this.hoveredIndex = this.filteredOptions.length > 0 ? 0 : -1;
  }

  isOptionSelected(option: SelectOption): boolean {
    return this.selectedItem?.hash === option.hash;
  }

  onOptionHover(index: number): void {
    this.hoveredIndex = index;
  }

  isOptionHovered(index: number): boolean {
    return this.hoveredIndex === index;
  }

  openDropdown(): void {
    this.isDropdownOpen = true;
    this.hoveredIndex = 0; // Começar no primeiro item
    this.updateFilteredOptions();
    setTimeout(() => {
      this.container.nativeElement.focus();
    }, 0);
  }

  onKeyDown(event: KeyboardEvent): void {
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
          // this.toggleOption(this.filteredOptions[this.hoveredIndex]);
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

}
