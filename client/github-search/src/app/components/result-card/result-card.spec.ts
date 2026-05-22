import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultCard } from './result-card';
import { IResultCard } from './result-card.interface';
import { By } from '@angular/platform-browser';
import { User } from '../../services/user';

describe('ResultCard', () => {
  let component: ResultCard;
  let fixture: ComponentFixture<ResultCard>;
  let mockUserService: jasmine.SpyObj<User>;

  const mockCard: IResultCard = {
    id: 12345,
    name: 'test-repo',
    full_name: 'owner/test-repo',
    owner: {
      avatar_url: 'https://avatar.test/owner'
    },
    html_url: 'https://github.com/owner/test-repo',
    description: 'A mock repository description for testing.',
    stargazers_count: 42,
    forks_count: 10
  };

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('User', ['isBookmarked']);
    mockUserService.isBookmarked.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [ResultCard],
      providers: [
        { provide: User, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display repository details correctly when card input is set', () => {
    fixture.componentRef.setInput('card', mockCard);
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('.repo-name')).nativeElement;
    const fullNameEl = fixture.debugElement.query(By.css('.full-name')).nativeElement;
    const descEl = fixture.debugElement.query(By.css('.description')).nativeElement;
    const avatarEl = fixture.debugElement.query(By.css('.owner-avatar')).nativeElement;
    const starsEl = fixture.debugElement.query(By.css('.stars .stat-count')).nativeElement;
    const forksEl = fixture.debugElement.query(By.css('.forks .stat-count')).nativeElement;

    expect(titleEl.textContent.trim()).toBe('test-repo');
    expect(titleEl.getAttribute('href')).toBe('https://github.com/owner/test-repo');
    expect(fullNameEl.textContent.trim()).toBe('owner/test-repo');
    expect(descEl.textContent.trim()).toBe('A mock repository description for testing.');
    expect(avatarEl.getAttribute('src')).toBe('https://avatar.test/owner');
    expect(starsEl.textContent.trim()).toBe('42');
    expect(forksEl.textContent.trim()).toBe('10');
  });

  it('should render fallback text when description is null', () => {
    const cardWithoutDesc: IResultCard = {
      ...mockCard,
      description: null
    };
    fixture.componentRef.setInput('card', cardWithoutDesc);
    fixture.detectChanges();

    const descEl = fixture.debugElement.query(By.css('.description')).nativeElement;
    expect(descEl.textContent.trim()).toBe('No description provided.');
  });

  it('should emit the card on favorite button click', () => {
    spyOn(component.favoriteEmit, 'emit');
    fixture.componentRef.setInput('card', mockCard);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.bookmark-btn'));
    button.nativeElement.click();

    expect(component.favoriteEmit.emit).toHaveBeenCalledWith(mockCard);
  });

  it('should apply active classes when isFavorite is true', () => {
    mockUserService.isBookmarked.and.returnValue(true);
    fixture.componentRef.setInput('card', mockCard);
    fixture.detectChanges();

    const cardContainer = fixture.debugElement.query(By.css('.result-card'));
    const bookmarkButton = fixture.debugElement.query(By.css('.bookmark-btn'));
    const bookmarkIcon = fixture.debugElement.query(By.css('.bookmark-icon'));

    expect(cardContainer.nativeElement.classList.contains('favorite-card')).toBeTrue();
    expect(bookmarkButton.nativeElement.classList.contains('active')).toBeTrue();
    expect(bookmarkIcon.nativeElement.textContent.trim()).toBe('bookmark');
  });

  it('should use non-active bookmark icon when isFavorite is false', () => {
    mockUserService.isBookmarked.and.returnValue(false);
    fixture.componentRef.setInput('card', mockCard);
    fixture.detectChanges();

    const bookmarkIcon = fixture.debugElement.query(By.css('.bookmark-icon'));
    expect(bookmarkIcon.nativeElement.textContent.trim()).toBe('bookmark_border');
  });
});

