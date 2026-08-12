import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
} from 'lucide-react';

import '../styles/AddQMTDevice.css';
import qmtDevice from '../assets/qmt-device.png';

export default function AddQMTDevice({ messages }) {
  /* =====================================================
     DEVICES
  ===================================================== */

  const [devices, setDevices] = useState([
    {
      id: '',
      name: '',
      farm: '',
    },
  ]);

  /* =====================================================
     FARMS
  ===================================================== */

  const [farms, setFarms] = useState([
    messages.defaultFarms.greenValley,
    messages.defaultFarms.sunrise,
  ]);

  const [newFarm, setNewFarm] = useState('');

  const [showAddFarm, setShowAddFarm] = useState(false);

  /* =====================================================
     ADD DEVICE
  ===================================================== */

  const addDevice = () => {
    setDevices((previousDevices) => [
      ...previousDevices,
      {
        id: '',
        name: '',
        farm: '',
      },
    ]);
  };

  /* =====================================================
     REMOVE DEVICE
  ===================================================== */

  const removeDevice = (index) => {
    if (devices.length === 1) {
      return;
    }

    setDevices((previousDevices) =>
      previousDevices.filter(
        (_, deviceIndex) => deviceIndex !== index
      )
    );
  };

  /* =====================================================
     UPDATE DEVICE
  ===================================================== */

  const updateDevice = (index, field, value) => {
    setDevices((previousDevices) =>
      previousDevices.map((device, deviceIndex) => {
        if (deviceIndex !== index) {
          return device;
        }

        return {
          ...device,
          [field]: value,
        };
      })
    );
  };

  /* =====================================================
     ADD FARM
  ===================================================== */

  const addFarm = () => {
    const farmName = newFarm.trim();

    if (!farmName) {
      return;
    }

    const farmAlreadyExists = farms.some(
      (farm) =>
        farm.toLowerCase() === farmName.toLowerCase()
    );

    if (farmAlreadyExists) {
      alert(messages.farmAlreadyExists);
      return;
    }

    setFarms((previousFarms) => [
      ...previousFarms,
      farmName,
    ]);

    setNewFarm('');

    setShowAddFarm(false);
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      IMPORTANT:

      Keep your existing backend / Supabase / API logic here.

      The data structure being prepared is:

      [
        {
          id: "QMT001",
          name: "Main Shed Device",
          farm: "Green Valley Farm"
        },
        {
          id: "QMT002",
          name: "Second Shed Device",
          farm: "Sunrise Farm"
        }
      ]
    */

    console.log('QMT Devices:', devices);
  };

  return (
    <main className="device-page">

      <section className="device-card">

        {/* =================================================
            BACK TO DASHBOARD
        ================================================= */}

        <a
          className="device-back"
          href="#dashboard"
        >
          <ArrowLeft size={16} />

          <span>
            {messages.backToDashboard}
          </span>
        </a>


        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="device-heading">

          <h1>
            {messages.title}
          </h1>

          <p>
            {messages.subtitle}
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="device-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              QMT DEVICE SECTION
          ================================================= */}

          <section className="device-section">

            <div className="section-header">

              <div>
                <h2>
                  {messages.devicesSectionTitle}
                </h2>

                <p>
                  {messages.devicesSectionDescription}
                </p>
              </div>


              <button
                type="button"
                className="add-device-small-button"
                onClick={addDevice}
              >
                <Plus size={17} />

                <span>
                  {messages.addDevice}
                </span>
              </button>

            </div>


            {/* =================================================
                DEVICE LIST
            ================================================= */}

            <div className="device-list">

              {devices.map((device, index) => (

                <div
                  className="device-item"
                  key={index}
                >

                  {/* DEVICE NUMBER */}

                  <div className="device-number">
                    {index + 1}
                  </div>


                  {/* DEVICE DETAILS */}

                  <div className="device-fields">

                    {/* QMT ID */}

                    <label className="form-field">

                      <span className="field-label">
                        {messages.qmtIdLabel}
                      </span>

                      <input
                        type="text"
                        value={device.id}
                        onChange={(event) =>
                          updateDevice(
                            index,
                            'id',
                            event.target.value
                          )
                        }
                        placeholder={messages.qmtIdPlaceholder}
                      />

                      <small>
                        {messages.qmtIdHelp}
                      </small>

                    </label>


                    {/* DEVICE NAME */}

                    <label className="form-field">

                      <span className="field-label">
                        {messages.deviceNameLabel}
                        <em>{messages.optional}</em>
                      </span>

                      <input
                        type="text"
                        value={device.name}
                        onChange={(event) =>
                          updateDevice(
                            index,
                            'name',
                            event.target.value
                          )
                        }
                        placeholder={messages.deviceNamePlaceholder}
                      />

                    </label>


                    {/* FARM */}

                    <label className="form-field">

                      <span className="field-label">
                        {messages.farmLabel}
                      </span>

                      <select
                        value={device.farm}
                        onChange={(event) =>
                          updateDevice(
                            index,
                            'farm',
                            event.target.value
                          )
                        }
                      >

                        <option
                          value=""
                          disabled
                        >
                          {messages.selectFarm}
                        </option>

                        {farms.map(
                          (farm, farmIndex) => (
                            <option
                              key={farmIndex}
                              value={farm}
                            >
                              {farm}
                            </option>
                          )
                        )}

                      </select>

                    </label>

                  </div>


                  {/* REMOVE DEVICE */}

                  {devices.length > 1 && (

                    <button
                      type="button"
                      className="remove-device-button"
                      onClick={() =>
                        removeDevice(index)
                      }
                      title={messages.removeDevice}
                      aria-label={`${messages.removeDevice} ${
                        index + 1
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>

                  )}

                </div>

              ))}

            </div>


            {/* DEVICE COUNT */}

            <div className="device-count">

              {devices.length}{' '}
              {devices.length === 1
                ? messages.deviceSingular
                : messages.devicePlural}{' '}
              {messages.added}

            </div>

          </section>


          {/* =================================================
              FARM SECTION
          ================================================= */}

          <section className="farm-section">

            <div className="section-header">

              <div>

                <h2>
                  {messages.farmsSectionTitle}
                </h2>

                <p>
                  {messages.farmsSectionDescription}
                </p>

              </div>


              <button
                type="button"
                className="add-farm-button"
                onClick={() =>
                  setShowAddFarm(
                    (previous) => !previous
                  )
                }
              >

                <Plus size={17} />

                <span>
                  {messages.addFarm}
                </span>

              </button>

            </div>


            {/* =================================================
                ADD FARM BOX
            ================================================= */}

            {showAddFarm && (

              <div className="add-farm-box">

                <input
                  type="text"
                  value={newFarm}
                  onChange={(event) =>
                    setNewFarm(event.target.value)
                  }
                  placeholder={messages.newFarmPlaceholder}
                  autoFocus
                />

                <button
                  type="button"
                  className="save-farm-button"
                  onClick={addFarm}
                >
                  {messages.addFarm}
                </button>

              </div>

            )}

          </section>


          {/* =================================================
              QMT INFORMATION
          ================================================= */}

          <section className="qmt-info-card">

            <div className="qmt-info-content">

              <h2>
                {messages.qmtHelpTitle}
              </h2>

              <p>
                {messages.qmtHelpDescription}
              </p>

            </div>


            <div className="qmt-image-wrapper">

              <img
                src={qmtDevice}
                alt={messages.qmtImageAlt}
              />

            </div>

          </section>


          {/* =================================================
              SUBMIT BUTTON
          ================================================= */}

          <button
            className="add-device-button"
            type="submit"
          >

            <Plus size={18} />

            <span>
              {(devices.length === 1 ? messages.submitSingular : messages.submitPlural)
                .replace('{count}', devices.length)}
            </span>

          </button>

        </form>

      </section>

    </main>
  );
}
