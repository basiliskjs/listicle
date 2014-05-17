/** @jsx React.DOM */

/**
 * A demo application for Basilisk with ReactJS.
 */
/* globals: basilisk, React */


; (function () {
    "use strict";
    var Entry = basilisk.makeStruct(['label', 'done']),
        List = basilisk.makeStruct(['title', 'entries']);


    var ListView = React.createClass({
        getInitialState: function () {
            return {
                list: new List({
                    title: 'Basic list',
                    entries: basilisk.Vector.from([
                        new Entry({
                            done: false,
                            label: 'Super-simple documentation.'
                        }),
                        new Entry({
                            done: false,
                            label: 'A better build system.'
                        }),
                        new Entry({
                            done: true,
                            label: 'Easy-to-use, high-performance value library for javascript.'
                        }),
                        new Entry({
                            done: false,
                            label: 'A playful icon.'
                        }),
                    ])
                }),

                // We can have an 'in-progress' entry: we are busy creating this before its saved.
                inProgress: null
            };
        },

        createNewEntry: function () {
            this.setState({ inProgress: new Entry({ label: '', done: false }) });
        },

        updateNewEntry: function (inputEvent) {
            var current = this.state.inProgress;
            this.setState({ inProgress: current.with_('label', inputEvent.target.value) });
        },

        addEntry: function (buttonEvent) {
            var current = this.state.list;
            this.setState({
                list: current.with_('entries', current.entries.push(this.state.inProgress)),
                inProgress: null
            })
        },

        render: function () {
            var items = [],
                list = this.state.list,
                that = this,
                entryPath = basilisk.query.path('entries');

            list.entries.forEach(function (item, index) {
                var changeHandler = function (updatedItem) {
                    window['that'] = that;
                    that.setState({
                        list: entryPath.swap(that.state.list, function (entries) { return entries.set(index, updatedItem) })
                    });
                };
                items.push(
                    <EntryView
                       key={index}
                       item={item}
                       updateHandler={changeHandler}
                    />
                )
            });

            // Any 'in-progress' items are added here.  The contents of the box itself is 'state'.
            var addition = (
                <span className="action">
                    <a
                        onClick={this.createNewEntry}
                        >
                        Add item
                    </a>
                </span>
            );

            if (this.state.inProgress) {
                addition = (
                    <div>
                        <input
                            type="text"
                            value={this.state.inProgress.label}
                            placeholder="Add item"

                            onChange={this.updateNewEntry}
                            />
                        <button
                            onClick={this.addEntry}
                            >Add</button>
                    </div>
                )
            }

            return (
            <div className="listbox">
                <h1>{list.title}</h1>

                <ol className="entries">
                { items }
                </ol>

                { addition }
            </div>
            )
        }
    });

    var EntryView = React.createClass({
        handleDoneClick: function () {
            this.props.updateHandler(this.props.item.with_('done', !this.props.item.done));
        },
        render: function () {
            var classes = ['entry'],
                item = this.props.item;

            if (item.done) {
                classes.push('done')
            }

            return (
                <li className={classes.join(' ')}>
                    <label>
                        <input type="checkbox" checked={item.done} onChange={this.handleDoneClick} />
                        {this.props.item.label}
                    </label>

                </li>
            );

            /*

             <span className="changelink">
             (<a>change</a>)
             </span>
             */
        }
    });


    // Attach and initialise the App.
    React.renderComponent(
        <ListView />,
        document.getElementById('root')
    );
})();