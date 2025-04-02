import { Element, Component } from '../../WebApp/WebApp.js';
import SelectInput from './SelectInput.js';

export class EnhancedDateInput extends Component<'div', EnhancedDateInput.EventMap> {
    protected static readonly MOTHS: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    protected component: Element<"div">;
    protected monthSelect: SelectInput;
    protected yearSelect: SelectInput;
    protected calendarContainer: Element<"div">;
    protected selectedDates: Map<Date, Element<'span'>>;
    protected days: Map<number, EnhancedDateInput.EntryDay>;
    protected limit: number;
    protected yearRange: number;
    protected yearFillMode: EnhancedDateInput.yearFillMode;

    public constructor(options: EnhancedDateInput.Options = {}) { super();
        this.limit = options.limit || 1;
        this.yearRange = options.yearRange || 10;
        this.yearFillMode = options.yearFillMode || 'both';
        this.selectedDates = new Map();
        this.monthSelect = this.createMonthSelect();
        this.yearSelect = this.createYearSelect();
        this.days = new Map();
        this.calendarContainer = Element.new('div').setAttribute('class', 'enhancedDateInput-calendar');

        this.component = Element.structure({
            type: 'div', attribs: { class: 'enhancedDateInput' }, childs: [
                Element.new('div').setAttribute('class', 'enhancedDateInput-selects').append(
                    this.monthSelect.getComponent(),
                    this.yearSelect.getComponent()
                ),
                this.createWeekdaysHeader(),
                this.calendarContainer
            ]
        });

        this.monthSelect.on('send', () => this.updateCalendar());
        this.yearSelect.on('send', () => this.updateCalendar());
        this.updateCalendar();
    }

    public getDay(day: number): EnhancedDateInput.EntryDay {
        const entry = this.days.get(day);
        if (!entry) throw new Error('Date element not found');
        return entry;
    }

    public getSelected(): Date[] {
        return [...this.selectedDates.keys()];
    }

    public initialize(year: number, month: number, days: number[]) {
        this.yearSelect.setSelected(year.toString());
        this.monthSelect.setSelected(EnhancedDateInput.MOTHS[month - 1]);
        this.updateCalendar();
        days.forEach((day) => {
            const dayEntry = this.days.get(day);
            if (dayEntry) {
                this.toggleDate(dayEntry.dateElement, dayEntry.date);
            }
        });
        this.dispatch('dateChange', [...this.selectedDates.keys()]);
        this.dispatch('initialize');
    }

    protected createMonthSelect(): SelectInput {
        return new SelectInput(EnhancedDateInput.MOTHS, 'Mes');
    }

    protected createYearSelect(): SelectInput {
        const currentYear = new Date().getFullYear();
        const length = ['backWard', 'forWard'].indexOf(this.yearFillMode)
        ? (this.yearRange * 2) + 1
        : this.yearRange + 1
        const startYear = this.yearFillMode == 'forWard'
        ? currentYear
        : currentYear - this.yearRange;
        const years = Array.from({length }, (_, i) => (startYear + i).toString());
        return new SelectInput(years, 'Año');
    }

    protected createWeekdaysHeader(): Element<'div'> {
        const weekdays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
        const header = Element.new('div').setAttribute('class', 'enhancedDateInput-weekdays');
        weekdays.forEach(day => {
            header.append(Element.new('span', day).setAttribute('class', 'enhancedDateInput-weekday'));
        });
        return header;
    }

    protected updateCalendar(): void {
        this.calendarContainer.clean();
        this.days = new Map();
        const month = this.monthSelect.getSelected();
        const year = parseInt(this.yearSelect.getSelected(), 10);

        if (month === '' || isNaN(year)) return;

        const monthIndex = EnhancedDateInput.MOTHS.indexOf(month);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDay = new Date(year, monthIndex, 1).getDay();

        // Ajustar el índice para que el lunes sea el primer día de la semana
        const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

        let week = Element.new('div').setAttribute('class', 'enhancedDateInput-week');

        for (let i = 0; i < adjustedFirstDay; i++) {
            week.append(Element.new('span').setAttribute('class', 'enhancedDateInput-date empty'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            if (week.HTMLElement.childNodes.length === 7) {
                this.calendarContainer.append(week);
                week = Element.new('div').setAttribute('class', 'enhancedDateInput-week');
            }

            const date = new Date(year, monthIndex, day);
            const dateElement = Element.new('span', day.toString()).setAttribute('class', 'enhancedDateInput-date');
            dateElement.on('click', () => this.toggleDate(dateElement, date));
            week.append(dateElement);
            this.days.set(day, {dateElement, date});
        }

        if (week.HTMLElement.childNodes.length > 0) {
            const emptyDays = 7 - week.HTMLElement.childNodes.length;
            for (let i = 0; i < emptyDays; i++) {
                week.append(Element.new('span').setAttribute('class', 'enhancedDateInput-date empty'));
            }
            this.calendarContainer.append(week);
        }
        this.dispatch('update', year, monthIndex + 1);
    }

    protected toggleDate(dateElement: Element<'span'>, date: Date): void {
        if (this.selectedDates.has(date)) {
            this.selectedDates.delete(date);
            dateElement.HTMLElement.classList.remove('selected');
            this.dispatch('removeDate', date);
        } else {
            if (this.limit >= 1 && this.selectedDates.size === this.limit) {
                const [[date, element]] = this.selectedDates.entries();
                this.selectedDates.delete(date);
                element.HTMLElement.classList.remove('selected');
                this.dispatch('removeDate', date);
            }
            this.selectedDates.set(date, dateElement);
            dateElement.HTMLElement.classList.add('selected');
            this.dispatch('addDate', date);
        }
        this.dispatch('dateChange', [...this.selectedDates.keys()]);
    }
}

export namespace EnhancedDateInput {
    export type yearFillMode = 'both' | 'backWard' | 'forWard';
    export interface Options {
        limit?: number;
        yearRange?: number;
        yearFillMode?: yearFillMode;
    }
    export interface EntryDay {
        dateElement: Element<'span'>;
        date: Date;
    }
    export type EventMap = {
        dateChange: (dates: Date[]) => void;
        addDate: (date: Date) => void;
        removeDate: (date: Date) => void;
        initialize: () => void;
        update: (year: number, month: number) => void;
    }
}

export default EnhancedDateInput;
